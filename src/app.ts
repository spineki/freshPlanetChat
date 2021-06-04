/**
 * This file is the entry point of the backend. We define here an apollo/expreess server
 */

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema/type-defs";
import { resolvers } from "./schema/resolvers";
const PORT = 5000;

// Our base app uses express
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    // According to specs, we suppose user already being authentificated
    // We mock here an authentification, by supposing that the current user is "user2".
    // In production, a block of code should be added to perform authentification (jwt, etc)
    // This way, other users than user 2 could use this API

    return { currentUser: { id: "2" } };
  },
});

// But we wrap it in an ApolloServer to use apollo utilities
server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(
    `🚀 Hi Freshplanet! Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
);
