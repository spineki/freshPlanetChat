# CODING TEST: PART 1

## RUNNING THE APP
To avoid port conflict between my tests and my running demon, the main app runs under `🚀 Server ready at http://localhost:5000/graphql` (notice port 5000).

You can run this project with `yarn install` to install the dependencies and then `yarn run start` or `yarn run demon`

## Note on authentification
Authentification was supposed to be already effective. Thus, I added in apollo Server configuration a context callback that will automatically log you as "user2". In a real production context, a complete authentification system, using jwt, etc, should be used instead.

## Assumptions and choices:
- The term "forums" will be used instead of "fora" because it better matches the list naming convention (adding an "s" at the end)
- Two forums cannot have the same name. This allows forum creation to use names to verify if the forum already exists.
- Since a database wasn't required, I directly load a `.json` file in the server memory. Data is modified directly by a mutation resolver. The code is thus longer than it would have been with database queries. For example, I have to generate a new ID by hand when a forum is added to the "database".
- SendingTime is computed server-side. This way, we simplify client mutation queries, we simplify time zone handling, we prevent users from sending a message to prior times (thus modifying chat history), and messages are already stored in order.
- I decided to implement a pagination system for messages. I could have gone for an offset system, but cursor-based pagination is now a "best practice" and allows more flexibility. Even though cursors usually are strings, an Int is enough because of the messages data structure.


## Extra Packages
Except for linters and prettier, and ts-dev (faster than nodemon), I did not use any extra package

## Tests:

I added several tests in the tests folder. They ensure that every requirement of the specs is fulfilled. I'm using jest so you can run `yarn run test` or `npm run test` to check that everything is working well.

## Github Actions
A `.github` folder can be found at the root of the project. A `yml` configuration file inside runs whenever this branch is pushed. Jest action launches the test files. Thus, we can quickly verify that integration is not broken. (CI)

## SCHEMA

The following schema is taken from the inspector page available thanks to the apollo server.
I provide below the full retrieved schema, but 
- directive @cacheControl
- CacheControlScope
- Upload

are not shown here because they were automatically created by apollo. (The SDL file can be found under `src/schema/type-defs.ts`)

```gql
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




