import { ApolloServer,gql } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

import resolvers from "./resolvers.js";
import schema from './schema.js';






const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});


server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});