/**
 * We redefine here typescripts type corresponding to type_defs to ease resolvers typing
 */

export type PageInfoType = {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: number;
  endCursor: number;
};

// MESSAGES ---------------------------

export type MessageConnectionType = {
  totalCount: number;
  edges: Array<MessageEdgeType>;
  pageInfo: PageInfoType;
};

export type MessageEdgeType = {
  cursor: number;
  node: MessageType;
};

export type MessageType = {
  text: string;
  senderID: string;
  sendingTime: string;
};

// FORUM ------------------------------

export type ForumType = {
  id: string;
  name: string;
  memberIDs: Array<string>;
  messages: Array<MessageType>;
};

// USER -------------------------------

export type UserType = {
  id: string;
  name: string;
  image: string;
};
