import { GraphQLDateTime } from "graphql-scalars";
import { forums, users } from "../fixtures/fixtures.json";

type MessageType = {
  text: string;
  senderID: string;
  sendingTime: string;
};

type ForumType = {
  id: string;
  name: string;
  memberIDs: Array<string>;
  messages: Array<MessageType>;
};

type UserType = {
  id: string;
  name: string;
  image: string;
};

export const resolvers = {
  Query: {
    forums(
      _parent: unknown,
      _args: unknown,
      context: { currentUser: UserType }
    ): Array<ForumType> {
      console.log(">> Query forums");
      // A user must be logged to request the list of forums
      if (!context.currentUser) {
        return null;
      }

      return forums;
    },

    forum(
      _parent: unknown,
      args: { id: string },
      context: { currentUser: { id: string } }
    ): ForumType {
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
      if (!matchingForum.memberIDs.includes(context.currentUser.id)) {
        return null;
      }

      return matchingForum;
    },

    me(
      _parent: unknown,
      _args: unknown,
      context: { currentUser: { id: string } }
    ): UserType {
      console.log(">> Query me ", context.currentUser);
      if (!context.currentUser) {
        return null;
      }

      return users.find((user) => user.id === context.currentUser.id);
    },
  },

  Mutation: {
    createForum(
      _parent: unknown,
      { input: { forumName } }: { input: { forumName: string } },
      context: { currentUser: { id: string } }
    ): ForumType {
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

      const newForum: ForumType = {
        id: newForumID.toString(),
        name: forumName,
        memberIDs: [context.currentUser.id],
        messages: [],
      };

      forums.push(newForum);

      return newForum;
    },

    joinForumByID(
      _parent: unknown,
      { input: { forumID } }: { input: { forumID: string } },
      context: { currentUser: { id: string } }
    ): ForumType {
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
      if (!forums[forumIndex].memberIDs.includes(context.currentUser.id)) {
        // joining the forum
        forums[forumIndex].memberIDs.push(context.currentUser.id);
      }

      // returning it allows user to chain query info with forum
      return forums[forumIndex];
    },

    joinForumByName(
      _parent: unknown,
      { input: { forumName } }: { input: { forumName: string } },
      context: { currentUser: { id: string } }
    ): ForumType {
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
      if (!forums[forumIndex].memberIDs.includes(context.currentUser.id)) {
        // joining the forum
        forums[forumIndex].memberIDs.push(context.currentUser.id);
      }

      // returning it allows user to chain query info with forum
      return forums[forumIndex];
    },

    createMessage(
      _parent: unknown,
      {
        input: { text, forumID },
      }: { input: { text: string; forumID: string } },
      context: { currentUser: { id: string } }
    ): MessageType {
      console.log("== Mutation createMessage");

      if (!context.currentUser) {
        return null;
      }

      // then, we verify if they have the right to send a message in the forum
      // forum existence verification
      const forum = forums.find((forum) => forum.id === forumID);
      if (forum === undefined) {
        return null;
      }

      // user in forum verification
      if (!forum.memberIDs.includes(context.currentUser.id)) {
        return null;
      }

      const newMessage = {
        text: text,
        senderID: context.currentUser.id,
        sendingTime: new Date().toISOString(),
      };

      // saving to "database"
      forum.messages.push(newMessage);

      return newMessage;
    },
  },

  // Misc Resolvers
  Forum: {
    members(
      parent: { memberIDs: Array<string> },
      _args: unknown,
      context: { currentUser: { id: string } }
    ): Array<UserType> {
      console.log("Forum => users : parent", parent, context.currentUser.id);

      // Here, we return the list of users of this forum

      // However, we don't want strangers to have acces to the list of users
      if (
        !context.currentUser ||
        !parent.memberIDs.includes(context.currentUser.id)
      ) {
        return null;
      }

      return users.filter((user) => parent.memberIDs.includes(user.id));
    },

    messages(
      parent: { id: string; memberIDs: Array<string> },
      _args: unknown,
      context: { currentUser: { id: string } }
    ): Array<MessageType> {
      console.log("Forum Message");

      // Here, we return the list of messages of this forum

      // However, we don't want strangers to have acces to the list of users
      if (
        !context.currentUser ||
        !parent.memberIDs.includes(context.currentUser.id)
      ) {
        return null;
      }

      const forum = forums.find((forum) => forum.id === parent.id);
      if (forum === undefined) {
        return null;
      }

      // According to the specs, messages should be returned in the newest -> oldest order
      // Messages are stored in our "database" in receiving order so no need to sort them.
      // so we just have to revert them
      return forum.messages.reverse();
    },
  },

  User: {
    forums(
      parent: { id: string },
      _args: unknown,
      context: { currentUser: { id: string } }
    ): Array<ForumType> {
      console.log("User => forums : parent", parent);
      // A user can have access to forums only he targets himself
      if (!context.currentUser || parent.id !== context.currentUser.id) {
        return null;
      }

      // Here, we only want to return the list of forums user joined
      return forums.filter((forum) =>
        forum.memberIDs.includes(context.currentUser.id)
      );
    },
  },

  Message: {
    sender(parent: { senderID: string }): UserType {
      console.log("Message sender");
      return users.find((user) => user.id === parent.senderID);
    },
  },

  // Example: 2021-05-31T19:08:12+00:00
  DateTime: GraphQLDateTime,
};
