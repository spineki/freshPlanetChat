import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./schema/type_defs";
import { resolvers } from "./schema/resolvers";
const PORT = 5000;

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    // According to specs, we suppose user being already authentificated
    // We mock here an authentification, by supposing that the current user is user 2.
    // In production, a block of code should be added to perform authentification (jwt, etc)
    // This way, other users than user 2 could use this API

    return { currentUser: { id: "2" } };
  },
});

server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
);
