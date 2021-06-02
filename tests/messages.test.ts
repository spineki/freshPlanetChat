/**
 * This files aims to give a suit of tests ensuring the specs given by freshplanet
 *
 * Behaviour tested: forum and messages interactions
 */

import { gql } from "apollo-server-express";
import { mutate, query, resetDatabase } from "./test-server";

describe("Once in a forum, a user can see the list of previous messages", () => {
  beforeAll(resetDatabase);

  test("User 2 cannot fetch all messages from forum 1", async () => {
    const GET_ALL_AVAILABLE_MESSAGES = gql`
      query {
        forum(id: "1") {
          messages(first: 10) {
            totalCount
            edges {
              node {
                text
                sendingTime
              }
            }
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
          messages(first: 10) {
            totalCount
            edges {
              node {
                text
                sendingTime
              }
            }
          }
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_MESSAGES });
    expect(data.forum.messages).toEqual({
      totalCount: 1,
      edges: [
        {
          node: {
            text: "message from user2 to forum 2",
            sendingTime: "2021-05-31T05:56:00.000Z",
          },
        },
      ],
    });
  });

  test("User 2 can fetch all messages from forum 3", async () => {
    const GET_ALL_AVAILABLE_MESSAGES = gql`
      query {
        forum(id: "3") {
          messages(first: 10) {
            totalCount
            edges {
              node {
                text
                sendingTime
              }
            }
          }
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_MESSAGES });
    expect(data.forum.messages).toEqual({
      totalCount: 2,
      edges: [
        {
          node: {
            text: "message from user1 to forum 3",
            sendingTime: "2021-05-31T05:57:00.000Z",
          },
        },
        {
          node: {
            text: "message from user2 to forum 3",
            sendingTime: "2021-05-31T05:55:00.000Z",
          },
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
          members {
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
          members {
            name
            image
          }
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_USERS });

    // we expect null, because user 2 is not in forum 1
    expect(data.forum).toEqual({
      members: [
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
          members {
            name
            image
          }
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_USERS });

    // we expect null, because user 2 is not in forum 1
    expect(data.forum).toEqual({
      members: [
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

  test("User 2 can fetch messages from forum 3 with related sendingTime", async () => {
    const GET_ALL_AVAILABLE_MESSAGES = gql`
      query {
        forum(id: "3") {
          messages(first: 10) {
            totalCount
            edges {
              node {
                text
                sender {
                  name
                  image
                }
                sendingTime
              }
            }
          }
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_MESSAGES });
    expect(data.forum.messages).toEqual({
      totalCount: 2,
      edges: [
        {
          node: {
            text: "message from user1 to forum 3",
            sender: {
              name: "userName1",
              image: "/path/to/image/user1",
            },
            sendingTime: "2021-05-31T05:57:00.000Z",
          },
        },
        {
          node: {
            text: "message from user2 to forum 3",
            sender: {
              name: "userName2",
              image: "/path/to/image/user2",
            },
            sendingTime: "2021-05-31T05:55:00.000Z",
          },
        },
      ],
    });
  });

  test("User 2 can post a message in forum 3", async () => {
    const CREATE_MESSAGE = gql`
      mutation {
        createMessage(input: { text: "A whole new message", forumID: "3" }) {
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
          messages(first: 10) {
            totalCount
            edges {
              node {
                text
                sender {
                  name
                  image
                }
              }
            }
          }
        }
      }
    `;

    const { data } = await query({ query: GET_ALL_AVAILABLE_MESSAGES });
    expect(data.forum.messages).toEqual({
      totalCount: 3,
      edges: [
        {
          node: {
            text: "A whole new message",
            sender: {
              name: "userName2",
              image: "/path/to/image/user2",
            },
          },
        },
        {
          node: {
            text: "message from user1 to forum 3",
            sender: {
              name: "userName1",
              image: "/path/to/image/user1",
            },
          },
        },
        {
          node: {
            text: "message from user2 to forum 3",
            sender: {
              name: "userName2",
              image: "/path/to/image/user2",
            },
          },
        },
      ],
    });
  });
});
