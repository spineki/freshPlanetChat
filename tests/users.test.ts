/**
 * This files aims to give a suit of tests ensuring the specs given by freshplanet
 *
 * Behaviour tested: user and forum interactions
 */
import { gql } from "apollo-server-express";
import { mutate, query, resetDatabase } from "./test-server";

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
        joinForumByName(input: { forumName: "forumName1" }) {
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
        joinForumByID(input: { forumID: "1" }) {
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
        createForum(input: { forumName: "forumName4" }) {
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
