import { gql } from "apollo-server-express";

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
    cursor: Int
    node: Message
  }

  ## USER -----------------------------
  type User {
    name: String!
    image: String!
    forums: [Forum]
  }
`;
