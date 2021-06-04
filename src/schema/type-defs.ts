import { gql } from "apollo-server-express";
import { GraphQLScalarType, Kind, ValueNode } from "graphql";

/**
 * A custom scalar type for DateTimes
 */
export const DateTimeScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "DateTime custom scalar type compliant with iso 8601",
  serialize(value: string) {
    return value; // DB already in string (JSON compliant)
  },
  parseValue(value: string) {
    return value;
  },
  parseLiteral(ast: ValueNode) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value).toISOString();
    }
    return null; // Invalid hard-coded value
  },
});

/**
 * SDL declaration of graphql schema
 */
export const typeDefs = gql`
  scalar DateTime

  type Query {
    forums: [Forum]!
    forum(id: ID!): Forum
    me: User
  }

  type Mutation {
    createForum(input: createForumInput!): Forum
    joinForumByID(input: joinForumByIDInput!): Forum
    joinForumByName(input: joinForumByNameInput!): Forum
    createMessage(input: createMessageInput!): Message
  }

  ## Pagination -----------------------

  type PageInfo {
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
    startCursor: Int!
    endCursor: Int!
  }

  ## FORUM ----------------------------

  type Forum {
    id: ID!
    name: String!
    members: [User]!
    messages(first: Int!, after: Int): MessageConnection
  }

  input createForumInput {
    forumName: String!
  }

  input joinForumByIDInput {
    forumID: ID!
  }

  input joinForumByNameInput {
    forumName: String!
  }

  ## MESSAGE --------------------------

  type Message {
    text: String!
    sender: User!
    sendingTime: String!
  }

  input createMessageInput {
    text: String!
    forumID: String!
  }

  type MessageConnection {
    totalCount: Int
    edges: [MessageEdge]!
    pageInfo: PageInfo!
  }

  type MessageEdge {
    cursor: Int!
    node: Message!
  }

  ## USER -----------------------------
  type User {
    name: String!
    image: String!
    forums: [Forum]
  }
`;
