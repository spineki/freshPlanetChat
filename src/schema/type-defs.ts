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
  """
  DateTime custom scalar type compliant with iso 8601
  """
  scalar DateTime

  """
  The schema's root query type
  """
  type Query {
    """
    Retrieve all existing forums
    """
    forums: [Forum]!

    """
    Retrieve forum having a specific ID
    """
    forum(id: ID!): Forum

    """
    Retrieve the current logged User
    """
    me: User
  }

  """
  The schema's root mutation type
  """
  type Mutation {
    """
    Create a new Forum if it doesn't already exist
    """
    createForum(input: createForumInput!): Forum

    """
    Join an existing forum having the given ID
    """
    joinForumByID(input: joinForumByIDInput!): Forum

    """
    Join an existing forum having the given Name
    """
    joinForumByName(input: joinForumByNameInput!): Forum

    """
    create a new message
    """
    createMessage(input: createMessageInput!): Message
  }

  ## Pagination -----------------------

  """
  Page Information to perform cursor-based pagination
  """
  type PageInfo {
    """
    True if a previous page exits
    """
    hasPreviousPage: Boolean!

    """
    True if a next page exists
    """
    hasNextPage: Boolean!

    """
    Cursor of the first node returned
    """
    startCursor: Int!

    """
    Cursor of the last node returned
    """
    endCursor: Int!
  }

  ## FORUM ----------------------------

  """
  A Forum
  """
  type Forum {
    id: ID!
    name: String!
    """
    Members of this Forum
    """
    members: [User]!
    """
    A cursor-based navigation object to paginate over forum messages
    """
    messages(first: Int!, after: Int): MessageConnection
  }

  """
  Required fields to createForumInput
  """
  input createForumInput {
    forumName: String!
  }

  """
  Required fields to joinForumByIDInput
  """
  input joinForumByIDInput {
    forumID: ID!
  }

  """
  Required fields to joinForumByNameInput
  """
  input joinForumByNameInput {
    forumName: String!
  }

  ## MESSAGE --------------------------

  """
  A message
  """
  type Message {
    text: String!
    sender: User!
    """
    The sending time of this message, computed when the message reaches the server
    """
    sendingTime: String!
  }

  """
  Required fields to createMessageInput
  """
  input createMessageInput {
    """
    The text content of the message
    """
    text: String!
    """
    The forumId of the forum targeted by this message
    """
    forumID: String!
  }

  """
  A connection object for a cursor-based pagniation over Messages
  """
  type MessageConnection {
    """
    Total number of messages
    """
    totalCount: Int

    """
    Edge for a cursor-based pagination over messages
    """
    edges: [MessageEdge]!

    """
    Info to paginate over received mesages
    """
    pageInfo: PageInfo!
  }

  """
  Edge for a cursor-based pagination over messages
  """
  type MessageEdge {
    """
    The cursor identifying a single message
    """
    cursor: Int!

    """
    Node containing a single Message
    """
    node: Message!
  }

  ## USER -----------------------------
  """
  A user
  """
  type User {
    name: String!
    """
    Avatar
    """
    image: String!
    """
    The list of forums where this user is a member
    """
    forums: [Forum]
  }
`;
