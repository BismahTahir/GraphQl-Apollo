import {  gql } from "apollo-server";

//schema here

//   type Mutation{
//      signUpUser(name:String!,address:String!):user
//    }
const typeDefs = gql`
  type Query {
    greet: String
    users: [user]
    quotes: [QuoteWithName]
    user(id: ID!): user
    singleQuote(by: ID!): [quote]
  }
  type quote {
    by: ID
    quote: String
  }
  type user {
    _id: ID!
    name: String
    email: String
    password: String
    address: String
    quotes: [quote]
  }

  type QuoteWithName {
    quote: String!
    by: IDNAME
  }
  type IDNAME {
    _id: ID!
    name: String
  }
  type Token {
    token: String!
  }

  type Mutation {
    signUpUser(newUser: userInput!): user
    signInUser(customUser: signInUser): Token
    createQuote(description: String!): String!
    deleteQuote(_id: ID!): quote
    updateQuote(_id: ID!, newQuote: String!): quote
  }

  input signInUser {
    userName: String!
    userEmail: String!
    password: String!
  }
  input userInput {
    name: String!
    address: String!
    email: String!
    password: String!
  }
`;

export default typeDefs;
