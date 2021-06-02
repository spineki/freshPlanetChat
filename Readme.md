# CODING TEST: PART 1

## Note on authentification
Authentification was supposed to be already effective. Thus, I added in apollo Server configuration a context callback that will automatically log you as "user2". In a real prodiction context, a complete authentification system, using jwt, etc, should be used instead.

## Assumptions and choices:
- The term "forums" will be used instead of "fora" because it better matches the list naming convention (adding an "s" at the end)
- Two forums cannot have the same name. This allows forum creation to use names to verify if the forum already exists.
- Since a database wasn't required, I directly load a `.json` file in the server memory. Data is modified directly by mutation resolver. The code is thus longer that it would have been with database queries. For example, I have to generate a new ID by hand when a forum is added to the "database".
- SendingTime is computed server-side. This way, we simplify client mutation queries, we simplify time zone handling, we prevend users from sending message to prior times (thus modifying chat history), and messages are already stored in order.
- I decided to implement a pagination system for messages. I could have gone for an offset system, but a cursor based pagination is now a "best practice" and allows more flexibility. Even though cursors usually are  strings, an Int is enough because of the messages data structure.


## Extra Packages
Except for linters and prettier, I did not use any extra package

## Tests:

I added several tests in the tests folder. They ensure that every requirement of the specs is fullfilled. I'm using jest so you can run `yarn run test` or `npm run test` to check that everything is working well.

## Github Actions
A `.github` folder can be found at the root of the project. A `yml`configuration file inside runs whenever this branch is pushed. Jest action launches the test files. Thus, we can quickly verify that integration is not broken.

## SCHEMA

The following schema is taken from the inspector page available thanks to apollo server.
I provide bellow the full retrieved schema, but 
- directive @cacheControl
- CacheControlScope
- Upload
are not shown here because they were automatically created by apollo. (The SDL file can be found under `src/schema/type-defs.ts`)

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




