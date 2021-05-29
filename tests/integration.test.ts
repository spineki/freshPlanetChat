import { ApolloServer, gql } from "apollo-server-express";
import { createTestClient } from "apollo-server-testing";
import { resolvers } from "../schema/resolvers";
import { typeDefs } from "../schema/type_defs";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { query, mutate } = createTestClient(server);

test("A user can see the list of forums he has joined.", async () => {
  const GET_ALL_JOINED_FORUMS = gql`
    query {
      user(id: 2) {
        forums {
          name
        }
      }
    }
  `;

  const { data } = await query({ query: GET_ALL_JOINED_FORUMS });
  expect(data.user.forums).toEqual([
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

describe("A user can join a forum if he knows the forum id", () => {
  
  test("User 3 is not in forum1", async () => {
    const GET_USER_FORUMS = gql`
      query  {
        user(id: "3") {
          name,
          forums {name}
        }
      }
    `;

    const { data } = await query({ query: GET_USER_FORUMS });
    expect(data.user.forums).toEqual(
      [
        {
          "name": "forumName3"
        }
      ]
    );
  })
  
  test("User 3 joins forums 1", async () => {
    const JOIN_FORUM_ONE = gql`
      mutation  {
        joinForum(userID:"3", forumID: "1") {
          name
        }
      }
    `;

    const { data } = await query({ query: JOIN_FORUM_ONE });
    expect(data.joinForum).toEqual(
      {
        name: "forumName1",
      },
    );
  });

  test("User 3 IS in forum1", async () => {
    const GET_USER_FORUMS = gql`
      query  {
        user(id: "3") {
          name,
          forums {name}
        }
      }
    `;

    const { data } = await query({ query: GET_USER_FORUMS });
    expect(data.user.forums).toEqual(
      [
        {
          "name": "forumName1"
        },
        {
          "name": "forumName3"
        }
      ]
    );
  })
});


describe("A user can create a new forum (and join it automatically)", () => {

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


  test("user 1 creates forum 4", async () => {
    const CREATE_FORUM = gql`
      mutation  {
        createForum(userID:"1", forumName: "forumName4") {
          name,
        }
      }
    `;
  
    const { data } = await query({ query: CREATE_FORUM });
    expect(data.createForum).toEqual(
      {"name": "forumName4"}
    );
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
