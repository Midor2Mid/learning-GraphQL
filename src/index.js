'use strict';

const express = require('@feathersjs/express');

const graphqlHTTP = require('express-graphql');

const {
    GraphQLID,
    GraphQLBoolean,
    GraphQLObjectType,
    GraphQLList,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLInputObjectType
} = require('graphql');

const { getVideoById, getVideos, createVideo } = require('./data');
const {
    globalIdField,
    connectionDefinitions,
    connectionFromPromisedArray,
    connectionArgs,
    mutationWithClientMutationId
} = require('graphql-relay');
const { nodeInterface, nodeField } = require('./node');

const PORT = process.env.PORT || 3000
const server = express();


const videoType = new GraphQLObjectType({
    name: 'Video',
    description: 'A video',
    fields: {
        id: globalIdField(),
        title: {
            type: GraphQLString,
            description: 'Video title.'
        },
        duration: {
            type: GraphQLInt,
            description: 'Video duration.'
        },
        watched: {
            type: GraphQLBoolean,
            description: 'Video watched or not.'
        },
    },
    interfaces: [nodeInterface],
});
exports.videoType = videoType;

const { connectionType: VideoConnection } = connectionDefinitions({
    nodeType: videoType,
    connectionFields:() => ({
        totalCount:{
            type: GraphQLInt,
            description: 'Count total number of Objects',
            resolve: (conn) => {
                return conn.edges.length;
            }
        }
    })
});

const videoMutation = mutationWithClientMutationId({
    name: 'AddVideo',
    inputFields: {
        title: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Video title.'
        },
        duration: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'Video duration.'
        },
        watched: {
            type: new GraphQLNonNull(GraphQLBoolean),
            description: 'Video watched or not.'
        },
    },
    outputFields:{
        video: {
            type: videoType
        },
    },
    mutateAndGetPayload: (args) => new Promise((resolve, reject)=> {
        Promise.resolve(createVideo(args))
        .then((video) => resolve({video}))
        .catch(reject);
    }),
});

const mutationType = new GraphQLObjectType({
    name: "Mutation",
    description: 'The root of mutation Type',
    fields: {
        createVideo: videoMutation,
    },
});

const queryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root of query Type',
    fields: {
        node: nodeField,
        videos: {
            type: VideoConnection,
            args: connectionArgs,
            resolve: (_, args) => connectionFromPromisedArray(
                getVideos(),
                args
            ),
        },
        video: {
            type: videoType,
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'The Video ID.',
                },
            },
            resolve: (_, args) => {
                return getVideoById(args.id);
            },
        },
    },
});

const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
})

server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));
server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})