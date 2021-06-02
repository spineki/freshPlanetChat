## Changes not visible in the schema

Part 2 needs additional modifications. Some specs are not visible in the schema but I wanted to describe them.

- To allow forums to be private, an extra field `private: Boolean` should be added to the database for every forum.
- Now that we can know if a forum is private, we also need an extra field `adminID: ID` in the Database for every forum. This field must be empty if the database is not private.
- Resolver `forums` must be updated not to display private forums (a simple if else should do the trick)


## Admin Verification logic

The following logic would be used for the admin verification

- An admin subscribes to `membershipRequest` to be be called when a member want to join a private forum.
- Then a user uses the `joinForumByIDInput` mutation to request the right to join the forum.
- if the forum is public, he directly joins it. Else, the following command is triggered `pubsub.publish('membershipRequest', { membershipRequest: { userID: userID, forumID:  forumID}})`
- The admin will receive the request through subscription. He now may be prompted to accept or not the entrance of the new member, through his react client, for example.
- To confirm, he can send a mutation `acceptMembership(input: {memberID, forumID})` that will add the user to the forum.

We can notice here that the requesting user will not receive info, if he is accepted, or not.

## CHANGED SCHEMA

```gql
# DateTime custom scalar type compliant with iso 8601
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
  acceptMembership(input: acceptMembershipInput): Membership
}

type Subscription {
    membershipRequest: Membership
}

type Membership {
    memberId: ID!
    forumId: ID!
}

type acceptMembershipInput {
    memberId: ID!
    forumId: ID!
}

type PageInfo {
  hasPreviousPage: Boolean!
  hasNextPage: Boolean!
  startCursor: Int!
  endCursor: Int!
}

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

type User {
  name: String!
  image: String!
  forums: [Forum]
}
```