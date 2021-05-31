import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar DateTime

  type Query {
    forums: [Forum]!
    forum(id: ID!): Forum
    me: User
  }

  type Mutation {
    createForum(forumName: String!): Forum
    joinForumByID(forumID: ID!): Forum
    joinForumByName(forumName: String!): Forum
    createMessage(input: MessageInput!): Message
  }

  input MessageInput {
    text: String!
    forumID: String!
    sendingTime: DateTime!
  }

  type Message {
    text: String!
    sender: User!
    forumID: String!
    sendingTime: String!
  }

  type User {
    name: String!
    image: String!
    forums: [Forum]
  }

  type Forum {
    id: ID!
    name: String!
    users: [User]!
    messages: [Message]!
  }
`;
