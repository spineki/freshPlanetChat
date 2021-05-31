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

  input createForumInput {
    forumName: String!
  }

  input joinForumByIDInput {
    forumID: ID!
  }

  input joinForumByNameInput {
    forumName: String!
  }

  input createMessageInput {
    text: String!
    forumID: String!
  }

  type Message {
    text: String!
    sender: User!
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
    members: [User]!
    messages: [Message]!
  }
`;
