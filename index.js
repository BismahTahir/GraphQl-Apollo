import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { users, quotes_ } from "./db.js";
import { randomBytes } from "crypto";

import { MONGO_URI, SECRET_KEY } from "./config.js";
import User from "./models/user.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
import mongoose from "mongoose";
mongoose.connect(MONGO_URI, {
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", (res) => {
  console.log("connected", process.env.NODE_ENV);
});

mongoose.connection.on("error", (err) => {
  console.log("error", err);
});

const context = ({ req }) => {
  const { authorization } = req.headers || "";

  // console.log("++++", authorization);
  const token = authorization.split(" ")[1];

  if (token) {
    const { userId } = jwt.verify(token, SECRET_KEY);
    // console.log(userId);
    return { userId };
  }
};

const typeDefs = gql`
  type Query {
    users: [User]
    quotes: [Quote]
    getUserById(id: ID!): User
  }

  type User {
    _id: ID!
    name: String
    email: String
    password: String
    address: String
    quotes: [Quote]
  }

  type Quote {
    by: ID!
    quote: String
  }

  type Mutation {
    addUser(inputUser: user!): [User]
    addQuote(by: ID!, quote: String): [Quote]
    signupUser(userpayload: userInput!): User
    signinUser(loginUser: signinUser): Token
  }

  type Token {
    token: String!
  }

  input userInput {
    name: String!
    email: String!
    password: String!
    address: String!
  }

  input signinUser {
    email: String!
    password: String!
  }
  input user {
    id: ID
    name: String
    address: String
  }
`;

const resolvers = {
  Query: {
    // users: () => {
    //   return users;
    // },
    users: async (parent,args,context,info) => {

      // console.log(parent);
      // console.log(args);
      console.log(context);
      // console.log(info)
      return await User.find({});
    },
    quotes: () => {
      return quotes_;
    },
    getUserById: (parent, args) => {
      return users.find((us) => us.id === Number(args.id));
    },
  },

  User: {
    quotes: (parent, args) => {
      return quotes_.filter((quote) => quote.by === parent.id);
    },
  },
  Mutation: {
    addUser: (parent, { inputUser }) => {
      const { name, address } = inputUser;

      let id = randomBytes(5).toString("hex");
      users.push({
        id,
        name,
        address,
      });
      return users;
    },

    addQuote: (parent, { by, quote }) => {
      quotes_.push({
        by,
        quote,
      });
      return quotes_;
    },
    signupUser: async (parent, { userpayload }) => {
      const user = await User.findOne({ email: userpayload.email });
      if (user) {
        throw new Error("User Already Exist");
      }

      const hashpassword = await bcrypt.hash(userpayload.password, 12);

      const user_ = await new User({
        ...userpayload,
        password: hashpassword,
      });

      return await user_.save();
    },
    signinUser: async (_, { loginUser }) => {
      console.log("signin", loginUser);
      const user = await User.findOne({ email: loginUser.email });
      if (!user) {
        throw new Error("User does not exist");
      }
      const checkPassword = await bcrypt.compare(
        loginUser.password,
        user.password
      );
      if (!checkPassword) {
        throw new Error("Invalid credentials");
      }
      const token = await jwt.sign({ userId: user._id }, SECRET_KEY);
      return {
        token: token,
      };
    },
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
