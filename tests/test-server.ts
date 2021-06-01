/**
 * This files aims to give a testclient server to be used in test files
 */

import { ApolloServer } from "apollo-server-express";
import { createTestClient } from "apollo-server-testing";
import { resolvers } from "../src/schema/resolvers";
import { typeDefs } from "../src/schema/type_defs";
import fixtures from "../src/fixtures/fixtures.json";

/**
 * A function to deep copy any given object
 *
 * @param obj - An object to deep copy
 * @returns deepCopied Object
 */
function deepCopy(obj: unknown) {
  return JSON.parse(JSON.stringify(obj));
}

// First we create the appolo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return { currentUser: { id: "2" } };
  },
});

export const { query, mutate } = createTestClient(server);

const cleanUsers = deepCopy(fixtures.users);
const cleanForums = deepCopy(fixtures.forums);
/**
 * A function to reset fixture "Database" and make sure test are independants
 */
export function resetDatabase(): void {
  fixtures.users = deepCopy(cleanUsers);
  fixtures.forums = deepCopy(cleanForums);
}
