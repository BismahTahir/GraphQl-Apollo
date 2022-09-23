import { ApolloServer, gql } from "apollo-server";

//schema here
const typeDefs = gql`
  type Query {
    greet: String
    users: [user]
    quotes: [quote]
    user(id: ID!): user
    singleQuote(by: ID!): [quote]
  }
  type quote {
    by: ID
    quote: String
  }
  type user {
    id: ID!
    name: String
    address: String
    quotes: [quote]
  }

  type Mutation{
    signUpUser(name:String!,address:String!):user

    
  }
`;

export default typeDefs;
