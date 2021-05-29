import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
} from "graphql";

// dummy data
const books = [
  { name: "blabla", genre: "fantasy", id: "1", authorId: "1" },
  { name: "blibli", genre: "sf", id: "2", authorId: "2" },
  { name: "bloblo", genre: "historuy", id: "3", authorId: "3" },
  { name: "blublu", genre: "geo", id: "4", authorId: "3" },
];

const authors = [
  { name: "author1", age: 10, id: "1" },
  { name: "author2", age: 20, id: "2" },
  { name: "author3", age: 30, id: "3" },
];

const BookType: GraphQLObjectType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return authors.find((element) => element.id === parent.authorId);
      },
    },
  }),
});

const AuthorType: GraphQLObjectType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: GraphQLList(BookType),
      resolve(parent, args) {
        return books.filter((element) => element.authorId === parent.id);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        const matchingBook = books.find((element) => element.id === args.id);
        return matchingBook;
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        const matchingAuthor = authors.find(
          (element) => element.id === args.id
        );
        return matchingAuthor;
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: RootQuery,
});
