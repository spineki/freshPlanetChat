import { GraphQLString, GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } from "graphql";

// dummy data
const examples = [
    {name: "ex1", id: "1" },
    {name: "ex2", id: "2" },
    {name: "ex3", id: "3" },
    {name: "ex4", id: "4" }
];

const ExampleType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Example',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        example: {
            type: ExampleType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                const matchingExample = examples.find((element) => element.id === args.id );
                return matchingExample;
            }
        }
    }
});


export const schema = new GraphQLSchema({
    query: RootQuery
});

