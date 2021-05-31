/**
 * This files aims to give a suit of tests ensuring the specs given by freshplanet
 */

import { ApolloServer, gql } from "apollo-server-express";
import { createTestClient } from "apollo-server-testing";
import { resolvers } from "../src/schema/resolvers";
import { typeDefs } from "../src/schema/type_defs";
import fixtures from "../src/fixtures/fixtures.json";

/**
 * A function to deep copy any given object
 *
 * @param obj - An object to deep copy
 * @returns deepCopied Object
 */
function deepCopy(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

// First we create the appolo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return { currentUser: { id: "2" } };
  },
});

const { query, mutate } = createTestClient(server);

const cleanUsers = deepCopy(fixtures.users);
const cleanForums = deepCopy(fixtures.forums);
/**
 * A function to reset fixture "Database" and make sure test are independants
 */
function resetDatabase() {
  fixtures.users = deepCopy(cleanUsers);
  fixtures.forums = deepCopy(cleanForums);
}
// USERS ----------------------------------------

test("A user can see the list of forums he has joined.", async () => {
  const GET_ALL_JOINED_FORUMS = gql`
    query {
      me {
        forums {
          name
        }
      }
    }
  `;

  const { data } = await query({ query: GET_ALL_JOINED_FORUMS });
  expect(data.me.forums).toEqual([
    {
      name: "forumName2",
    },
    {
      name: "forumName3",
    },
  ]);
});

test("A user can see the list of available forums", async () => {
  const GET_ALL_AVAILABLE_FORUMS = gql`
    query {
      forums {
        name
      }
    }
  `;

  const { data } = await query({ query: GET_ALL_AVAILABLE_FORUMS });
  expect(data.forums).toEqual([
    {
      name: "forumName1",
    },
    {
      name: "forumName2",
    },
    {
      name: "forumName3",
    },
  ]);
});

describe("A user can join any available forums", () => {
  beforeAll(resetDatabase);
  test("User 2 is not in forum1", async () => {
    const GET_USER_FORUMS = gql`
      query {
        me {
          name
          forums {
            name
          }
        }
      }
    `;

    const { data } = await query({ query: GET_USER_FORUMS });
    expect(data.me.forums).toEqual([
      {
        name: "forumName2",
      },
      {
        name: "forumName3",
      },
    ]);
  });

  test("User 2 joins forums 1", async () => {
    const JOIN_FORUM_ONE = gql`
      mutation {
        joinForumByName(forumName: "forumName1") {
          name
        }
      }
    `;

    const { data } = await mutate({ mutation: JOIN_FORUM_ONE });
    expect(data.joinForumByName).toEqual({
      name: "forumName1",
    });
  });

  test("User 2 IS in forum1", async () => {
    const GET_USER_FORUMS = gql`
      query {
        me {
          forums {
            name
          }
        }
      }
    `;

    const { data } = await query({ query: GET_USER_FORUMS });
    expect(data.me.forums).toEqual([
      {
        name: "forumName1",
      },
      {
        name: "forumName2",
      },
      {
        name: "forumName3",
      },
    ]);
  });
});

describe("A user can join a forum if he knows the forum id", () => {
  beforeAll(resetDatabase);

  test("User 2 is not in forum1", async () => {
    const GET_USER_FORUMS = gql`
      query {
        me {
          name
          forums {
            name
          }
        }
      }
    `;

    const { data } = await query({ query: GET_USER_FORUMS });
    expect(data.me.forums).toEqual([
      {
        name: "forumName2",
      },
      {
        name: "forumName3",
      },
    ]);
  });

  test("User 2 joins forums 1", async () => {
    const JOIN_FORUM_ONE = gql`
      mutation {
        joinForumByID(forumID: "1") {
          name
        }
      }
    `;

    const { data } = await mutate({ mutation: JOIN_FORUM_ONE });
    expect(data.joinForumByID).toEqual({
      name: "forumName1",
    });
  });

  test("User 2 IS in forum1", async () => {
    const GET_USER_FORUMS = gql`
      query {
        me {
          name
          forums {
            name
          }
        }
      }
    `;

    const { data } = await query({ query: GET_USER_FORUMS });
    expect(data.me.forums).toEqual([
      {
        name: "forumName1",
      },
      {
        name: "forumName2",
      },
      {
        name: "forumName3",
      },
    ]);
  });
});

describe("A user can create a new forum (and join it automatically)", () => {
  beforeAll(resetDatabase);

  test("forum 4 does not exist", async () => {
    const GET_ALL_AVAILABLE_FORUMS = gql`
      query {
        forums {
          name
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_FORUMS });
    expect(data.forums).toEqual([
      {
        name: "forumName1",
      },
      {
        name: "forumName2",
      },
      {
        name: "forumName3",
      },
    ]);
  });

  test("user 2 creates forum 4", async () => {
    const CREATE_FORUM = gql`
      mutation {
        createForum(forumName: "forumName4") {
          name
        }
      }
    `;

    const { data } = await mutate({ mutation: CREATE_FORUM });
    expect(data.createForum).toEqual({ name: "forumName4" });
  });

  test("forum 4 EXISTS", async () => {
    const GET_ALL_AVAILABLE_FORUMS = gql`
      query {
        forums {
          name
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_FORUMS });
    expect(data.forums).toEqual([
      {
        name: "forumName1",
      },
      {
        name: "forumName2",
      },
      {
        name: "forumName3",
      },
      {
        name: "forumName4",
      },
    ]);
  });
});

// MESSAGES -------------------------------------

describe("Once in a forum, a user can see the list of previous messages", () => {
  beforeAll(resetDatabase);

  test("User 2 cannot fetch all messages from forum 1", async () => {
    const GET_ALL_AVAILABLE_MESSAGES = gql`
      query {
        forum(id: "1") {
          messages {
            text
            sendingTime
          }
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_MESSAGES });

    // we expect null, because user 2 is not in forum 1
    expect(data.forum).toEqual(null);
  });

  test("User 2 can fetch all messages from forum 2", async () => {
    const GET_ALL_AVAILABLE_MESSAGES = gql`
      query {
        forum(id: "2") {
          messages {
            text
            sendingTime
          }
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_MESSAGES });
    expect(data.forum).toEqual({
      messages: [
        {
          sendingTime: "2020-12-09T16:09:50.000Z",
          text: "message from user2 to forum 2",
        },
      ],
    });
  });

  test("User 2 can fetch all messages from forum 3", async () => {
    const GET_ALL_AVAILABLE_MESSAGES = gql`
      query {
        forum(id: "3") {
          messages {
            text
            sendingTime
          }
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_MESSAGES });
    expect(data.forum).toEqual({
      messages: [
        {
          sendingTime: "2020-12-09T16:05:55.000Z",
          text: "message from user2 to forum 3",
        },
        {
          sendingTime: "2020-12-09T16:09:53.000Z",
          text: "message from user1 to forum 3",
        },
      ],
    });
  });
});

describe("Once in a forum, a user can see the name and picture of the members of the forum", () => {
  test("User 2 cannot see users from forum 1", async () => {
    const GET_ALL_AVAILABLE_USERS = gql`
      query {
        forum(id: "1") {
          users {
            name
            image
          }
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_USERS });

    // we expect null, because user 2 is not in forum 1
    expect(data.forum).toEqual(null);
  });

  test("User 2 CAN see users from forum 2", async () => {
    const GET_ALL_AVAILABLE_USERS = gql`
      query {
        forum(id: "2") {
          users {
            name
            image
          }
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_USERS });

    // we expect null, because user 2 is not in forum 1
    expect(data.forum).toEqual({
      users: [
        {
          name: "userName1",
          image: "/path/to/image/user1",
        },
        {
          name: "userName2",
          image: "/path/to/image/user2",
        },
      ],
    });
  });

  test("User 2 CAN see users from forum 3", async () => {
    const GET_ALL_AVAILABLE_USERS = gql`
      query {
        forum(id: "3") {
          users {
            name
            image
          }
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_USERS });

    // we expect null, because user 2 is not in forum 1
    expect(data.forum).toEqual({
      users: [
        {
          name: "userName1",
          image: "/path/to/image/user1",
        },
        {
          name: "userName2",
          image: "/path/to/image/user2",
        },
        {
          name: "userName3",
          image: "/path/to/image/user3",
        },
      ],
    });
  });
});

describe("Once in a forum, a user can post a message in the forum", () => {
  beforeAll(resetDatabase);

  test("User 2 can fetch messages from forum 3", async () => {
    const GET_ALL_AVAILABLE_MESSAGES = gql`
      query {
        forum(id: "3") {
          messages {
            text
            sender {
              name
              image
            }
          }
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_MESSAGES });
    expect(data.forum).toEqual({
      messages: [
        {
          text: "message from user2 to forum 3",
          sender: {
            name: "userName2",
            image: "/path/to/image/user2",
          },
        },
        {
          text: "message from user1 to forum 3",
          sender: {
            name: "userName1",
            image: "/path/to/image/user1",
          },
        },
      ],
    });
  });

  test("User 2 can post a message in forum 3", async () => {
    const CREATE_MESSAGE = gql`
      mutation {
        createMessage(
          input: {
            text: "A whole new message"
            forumID: "3"
            sendingTime: "2020-12-09T16:09:54.000Z"
          }
        ) {
          text
        }
      }
    `;

    const { data } = await mutate({ mutation: CREATE_MESSAGE });
    expect(data.createMessage).toEqual({
      text: "A whole new message",
    });
  });

  test("The new message is in forum 3", async () => {
    const GET_ALL_AVAILABLE_MESSAGES = gql`
      query {
        forum(id: "3") {
          messages {
            text
            sender {
              name
              image
            }
          }
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_MESSAGES });
    expect(data.forum).toEqual({
      messages: [
        {
          text: "message from user2 to forum 3",
          sender: {
            name: "userName2",
            image: "/path/to/image/user2",
          },
        },
        {
          text: "message from user1 to forum 3",
          sender: {
            name: "userName1",
            image: "/path/to/image/user1",
          },
        },
        {
          text: "A whole new message",
          sender: {
            name: "userName2",
            image: "/path/to/image/user2",
          },
        },
      ],
    });
  });
});

// - see the name and picture of the members of the forum

// test("")
