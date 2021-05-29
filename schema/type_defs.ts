import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    forums: [Forum]!
    forum(id: ID!): Forum
    user(id: ID!): User
    messages: [Message]!
  }

  type Mutation {
    createForum(userID: ID!, forumName: String!): Forum
    joinForumByID(userID: ID!, forumID: ID!): Forum
    joinForumByName(userID: ID!, forumName: String!): Forum
  }

  type Message {
    text: String!
    name: String!
    picture: String!
  }

  type User {
    name: String!
    image: String!
    forums: [Forum]!
  }

  type Forum {
    id: ID!,
    name: String!
    users: [User]!
    messages: [Message]!
  }
`;
