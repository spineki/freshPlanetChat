# Part 2
## Changes not visible in the schema

Part 2 needs additional modifications. Some specs are not visible in the schema but I wanted to describe them.

- To allow forums to be private, an extra field `private: Boolean` should be added to the database for every forum.
- Now that we know if a forum is private, we also need an extra field `adminID: ID` in the database for every forum. This field must be empty if the database is not private.
- Resolver `forums` must be updated not to display private forums (a simple if-else should do the trick)


## Admin Verification logic

The following logic would be used for the admin verification

- An admin subscribes to `membershipRequest` to be called when a member wants to join a private forum.
- Then a user uses the `joinForumByIDInput` mutation to request the right to join the forum.
- if the forum is public, he directly joins it. Else, the following command is triggered `pubsub.publish('membershipRequest', { membershipRequest: { userID: userID, forumID:  forumID}})`
- The admin will receive the request through subscription. He now may be prompted to accept or not the entrance of the new member, through his react client, for example.
- To confirm, he can send a mutation `acceptMembership(input: {memberID, forumID})` that will add the user to the forum.

We can notice here that the requesting user will not receive info if he is accepted, or not.

## CHANGED SCHEMA

``` gql
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
    Create a new message
    """
    createMessage(input: createMessageInput!): Message

    """
    Accept a request of membership (only usable by admins)
    """
    acceptMembership(input: acceptMembershipInput): Membership
  }


  ## Membership -----------------------
  """
  A membership subscription
  """
  type Subscription {
    membershipRequest: Membership
  }

  """
  A Membership Request
  """
  type Membership {
    memberId: ID!
    forumId: ID!
  }

  """
  Required fields to acceptMembership
  """
  type acceptMembershipInput{
    memberId: ID!
    forumId: ID!
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
  Required fields to createForum
  """
  input createForumInput {
    forumName: String!
  }

  """
  Required fields to joinForumByID
  """
  input joinForumByIDInput {
    forumID: ID!
  }

  """
  Required fields to joinForumByName
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
  Required fields to createMessage
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

```