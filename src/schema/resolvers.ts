import { GraphQLDateTime } from "graphql-scalars";
import { forums, users, messages } from "../fixtures/fixtures.json";

export const resolvers = {
  Query: {
    forums(parent: any, args: any, context: { currentUser: any }) {
      console.log(">> Query forums");
      // A user must be logged to request the list of forums
      if (!context.currentUser) {
        return null;
      }

      return forums;
    },

    forum(
      parent: any,
      args: { id: string },
      context: { currentUser: { id: string } }
    ) {
      console.log(">> Query forum ", args.id);
      // A user must be logged to request a forum
      if (!context.currentUser) {
        return null;
      }

      // The requested if must match an existing forum
      const matchingForum = forums.find((forum) => forum.id === args.id);
      if (matchingForum === undefined) {
        return null;
      }

      // the user must be in the forum to have the right to get info from it
      if (!matchingForum.userIDs.includes(context.currentUser.id)) {
        return null;
      }

      return matchingForum;
    },

    me(parent: any, args: any, context: { currentUser: { id: string } }) {
      console.log(">> Query me ", context.currentUser);
      if (!context.currentUser) {
        return null;
      }

      return users.find((user) => user.id === context.currentUser.id);
    },
  },

  Mutation: {
    createForum(
      _: any,
      { forumName }: { forumName: string },
      context: { currentUser: { id: any } }
    ) {
      console.log("== Mutation createForum", forumName);

      if (!context.currentUser) {
        return null;
      }

      // First, we verify if a forum is having the same name already exists
      const alreadyExistingForumIndex = forums.findIndex(
        (forum) => forum.name === forumName
      );
      if (forums[alreadyExistingForumIndex] !== undefined) {
        return null;
      }

      // Now we know the forum doesn't exist, we can create a new one
      // we find the max forum id and we do a + 1 to guaranty a whole new id
      const newForumID =
        1 +
        forums.reduce(
          (maxForumID, currentForum) =>
            Math.max(maxForumID, parseInt(currentForum.id)),
          parseInt(forums[0].id)
        );

      const newForum = {
        id: newForumID.toString(),
        name: forumName,
        userIDs: [context.currentUser.id],
        messages: [],
      };

      forums.push(newForum);

      return newForum;
    },

    joinForumByID(
      _: any,
      { forumID }: { forumID: string },
      context: { currentUser: { id: string } }
    ) {
      console.log("== Mutation joinForumByID", forumID);

      if (!context.currentUser) {
        return null;
      }

      // looking for the requested forum
      const forumIndex = forums.findIndex((forum) => forum.id === forumID);
      if (forums[forumIndex] === undefined) {
        return null;
      }

      // verifying if user is already registered
      if (!forums[forumIndex].userIDs.includes(context.currentUser.id)) {
        // joining the forum
        forums[forumIndex].userIDs.push(context.currentUser.id);
      }

      // returning it allows user to chain query info with forum
      return forums[forumIndex];
    },

    joinForumByName(
      _: any,
      { forumName }: { forumName: string },
      context: { currentUser: { id: string } }
    ) {
      console.log("== Mutation joinForumByName");

      if (!context.currentUser) {
        return null;
      }

      // looking for the requested forum
      const forumIndex = forums.findIndex((forum) => forum.name === forumName);
      if (forums[forumIndex] === undefined) {
        return null;
      }

      // verifying if user is already registered
      if (!forums[forumIndex].userIDs.includes(context.currentUser.id)) {
        // joining the forum
        forums[forumIndex].userIDs.push(context.currentUser.id);
      }

      // returning it allows user to chain query info with forum
      return forums[forumIndex];
    },

    createMessage(
      _: any,
      {
        input: { text, forumID, sendingTime },
      }: { input: { text: string; forumID: string; sendingTime: number } },
      context: { currentUser: { id: string } }
    ) {
      console.log("== Mutation createMessage");

      if (!context.currentUser) {
        return null;
      }

      // first we look in the "database to find the sender"
      const sender = users.find((user) => user.id === context.currentUser.id);
      if (sender === undefined) {
        return null;
      }

      // then, we verify if they have the right to send a message in the forum
      // forum existence verification
      const forum = forums.find((forum) => forum.id === forumID);
      if (forum === undefined) {
        return null;
      }

      // user in forum verification
      if (!forum.userIDs.includes(context.currentUser.id)) {
        return null;
      }

      // converting date to unix time in second: This choice allows:
      // - Less space taken in database
      // - Faster and simpler sorting algorithm
      const unixSendingTime = parseInt(
        (new Date(sendingTime).getTime() / 1000).toFixed(0)
      );

      const newMessage = {
        text: text,
        senderName: sender.name,
        senderPicture: sender.image,
        forumID: forumID,
        sendingTime: unixSendingTime,
      };

      // saving to "database"
      messages.push(newMessage);

      return newMessage;
    },
  },

  // Misc Resolvers
  Forum: {
    users(
      parent: { userIDs: any },
      args: any,
      context: { currentUser: { id: any } }
    ) {
      console.log("Forum => users : parent", parent, context.currentUser.id);

      // Here, we return the list of users of this forum

      // However, we don't want strangers to have acces to the list of users
      if (
        !context.currentUser ||
        !parent.userIDs.includes(context.currentUser.id)
      ) {
        return null;
      }

      return users.filter((user) => parent.userIDs.includes(user.id));
    },

    messages(parent: { id: string }) {
      console.log("Forum Message");

      // According to the specs, messages should be returned in the newest -> oldest order
      // Messages are stored in the database in unix time, so we can just sort them this way
      const sortedMessage = [
        ...messages.filter((message) => message.forumID === parent.id),
      ].sort((a, b) => a.sendingTime - b.sendingTime);

      // If dateTimes were stored with string, I would have needed Schwartzian transform
      // not to spend too much time in sort, converting strings back to Date object to be able to compare them.

      // However, I made the assumption that clients want Date as strings ISO 8601 compliant
      return sortedMessage.map((message) => {
        return {
          ...message,
          sendingTime: new Date(message.sendingTime * 1000).toISOString(),
        };
      });
    },
  },

  User: {
    forums(
      parent: { id: string },
      args: any,
      context: { currentUser: { id: string } }
    ) {
      console.log("User => forums : parent", parent);
      if (!context.currentUser) {
        return null;
      }

      // Here, we only want to return the list of forums user joined
      return forums.filter((forum) =>
        forum.userIDs.includes(context.currentUser.id)
      );
    },
  },

  // Example: 2021-05-31T19:08:12+00:00
  DateTime: GraphQLDateTime,
};
