import { forums, users, messages } from "../fixtures/fixtures.json";

export const resolvers = {
  Query: {
    forums() {
      console.log(">> Query forums");
      return forums;
    },

    forum(parent: any, args: {id: string}) {
      console.log(">> Query forum ", args.id);
      return forums.find((forum) => forum.id === args.id);
    },

    user(parent: any, args: { id: string }) {
      console.log(">> Query user ", args.id);
      return users.find((user) => user.id === args.id);
    },
    messages() {
      console.log(">> Query messages");
      return messages;
    },
  },

  Mutation: {
    createForum(
      _: any,
      { userID, forumName }: { userID: string; forumName: string }
    ) {
      console.log("== Mutation createForum", userID, forumName );

      // First, we verify if a forum is having the same name already exists
      let alreadyExistingForumIndex = forums.findIndex((forum) => forum.name === forumName);
      if (forums[alreadyExistingForumIndex] !== undefined) {
        return null;
      }

      // Now we know the forum doesn't exist, we can create a new one
      // we find the max forum id and we do a + 1 to guaranty a whole new id
      const newForumID = 1 + forums.reduce((maxForumID, currentForum) => Math.max(maxForumID, parseInt(currentForum.id)), parseInt(forums[0].id))

      const newForum = {
        id: newForumID.toString(),
        name : forumName,
        userIDs: [userID],
        messages: []
      }

      forums.push(newForum);

      return newForum;
    },

    joinForum(
      _: any,
      { userID, forumID }: { userID: string; forumID: string }
    ) {
      console.log("== Mutation joinForum");

      // looking for the requested forum
      let forumIndex = forums.findIndex((forum) => forum.id === forumID);
      if (forums[forumIndex] === undefined) {
        return null;
      }

      // verifying if user is already registered
      if (!forums[forumIndex].userIDs.includes(userID)) {
        // joining the forum
        forums[forumIndex].userIDs.push(userID);
      }

      // returning it allows user to chain query info with forum
      return forums[forumIndex];
    },
  },

  // Misc Resolvers
  Forum: {
    users(parent: { userIDs: any }, args: any) {
      console.log("Forum => users : parent", parent);
      return users.filter((user) => parent.userIDs.includes(user.id));
    },
  },

  User: {
    forums(parent: { id: string }, args: any) {
      console.log("User => forums : parent", parent);
      return forums.filter((forum) => forum.userIDs.includes(parent.id));
    },
  },
};
