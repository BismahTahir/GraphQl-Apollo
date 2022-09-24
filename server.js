import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import mongoose from "mongoose";
import { MONGO_URI, SECRET_KEY } from "./config.js";

import jwt from 'jsonwebtoken';

import schema from './schema.js';

import dotenv from "dotenv";
dotenv.config();
mongoose.connect(MONGO_URI,{
// userNewUrlParser:true,
useUnifiedTopology:true

})
// .then(res=>{
//   // console.log(res)
// })
// .catch(err=>{
//   console.log(err)
// })

mongoose.connection.on("connected",(res)=>{
  console.log("connected", process.env.NODE_ENV);
});


mongoose.connection.on("error", (err) => {
  console.log("error",err);
});


const context= ({ req }) => {
  const { authorization } = req.headers || "";

  // console.log("++++", authorization);
  const token = authorization.split(" ")[1];

  if (token) {
    const { userId } = jwt.verify(token, SECRET_KEY);
    // console.log(userId);
    return { userId };
  }
};
// import './models/user.js';
// import   "./models/quote.js";
import resolvers from "./resolvers.js";
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  // introspection: process.env.NODE_ENV !== "production",
  context,
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});


server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});