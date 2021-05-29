import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema/type_defs";
import { resolvers } from "./schema/resolvers";
const PORT = 5000;

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
