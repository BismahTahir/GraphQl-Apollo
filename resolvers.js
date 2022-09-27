import { users, quotes_ } from "./db.js";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import User from "./models/user.js";
import Quote from './models/quotes.js';
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "./config.js";
const resolvers = {
  Query: {
    greet: () => {
      return "hello bisma";
    },
    users: async () => {
      return await User.find({});
    },
    quotes: async () => {
      return await Quote.find({}).populate("by", "_id name");
    },
    user: async (parent, args) => {
      return await User.findOne({ _id: args._id });
      // return users.find((us) => us.id == args.id);
    },
    singleQuote: async (parent, { by }) => {
      return await Quote.find({ by });
      // return quotes_.filter((quo) => quo.by == by);
    },
  },
  user: {
    quotes: async (user) => {
      // console.log(user.id);
      // return quotes_.filter((quote) => quote.by == user.id);
      return await Quote.find({ by: user._id });
    },
  },
  Mutation: {
    // signUpUser: (parent,{name,address}) => {
    //     const id = randomBytes(5).toString("hex");
    //     users.push({id,name,address});
    //     return users.find(user=>user.id===id)
    // },

    signUpUser: async (parent, { newUser }) => {
      //   const id = randomBytes(5).toString("hex");
      //   const {name,address}=newUser
      //   users.push({ id, name, address });
      //   return users.find((user) => user.id === id);

      const user = await User.findOne({ email: newUser.email });

      console.log(user);
      if (user) {
        throw new Error("User already exists");
      }

      const hashPassword = await bcrypt.hash(newUser.password, 12);

      const user_ = await new User({
        ...newUser,
        password: hashPassword,
      });
      return await user_.save();
    },
    signInUser: async (parent, { customUser }) => {
      const user = await User.findOne({ email: customUser.userEmail });
      if (!user) {
        throw new Error("User does not exist");
      }

      const result = await bcrypt.compare(customUser.password, user.password);
      if (!result) {
        throw new Error("Invalid password");
      }
      const token = jwt.sign({ userId: user._id }, SECRET_KEY);

      return {
        token: token,
      };
    },
    createQuote: async (parent, { description }, { userId }) => {
      console.log("===>", userId);
      if (!userId) throw new Error("You must be logged In");

      const singleUser = await User.findById({
        _id: userId,
      });

      const quote = await new Quote({
        quote: description,
        by: singleUser._id,
      });
      await quote.save();
      return "Quote has been creadted";
    },

    updateQuote: async (parent, { _id, newQuote }) => {
      const res = await Quote.findOneAndUpdate({ _id }, { quote: newQuote });

      return res;
    },
    deleteQuote: async (parent, { _id }, context) => {
      const quote = await Quote.findByIdAndRemove({ _id });

      return quote;
    },
  },
};

export default resolvers;
