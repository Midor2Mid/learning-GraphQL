'use strict';
const express = require('@feathersjs/express');
const graphqlHTTP = require('express-graphql');
//const { graphql, buildSchema } = require('graphql');
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
} = require('graphql-relay');
const { nodeInterface, nodeField } = require('./node');

const PORT = process.env.PORT || 3000
const server = express();


const videoType = new GraphQLObjectType({
    name: 'Video',
    description: 'A video',
    fields: {
        id: globalIdField(),
        // id: {
        //     type: new GraphQLNonNull(GraphQLID),
        //     description: 'Video ID.'
        // },
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

const videoInputType = new GraphQLInputObjectType({
    name: 'VideoInput',
    fields: {
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
});

const mutationType = new GraphQLObjectType({
    name: "Mutation",
    description: 'The root of mutation Type',
    fields: {
        createVideo: {
            type: videoType,
            args: {
                // title: {
                //     type: new GraphQLNonNull(GraphQLString),
                //     description: 'Video title.'
                // },
                // duration: {
                //     type: new GraphQLNonNull(GraphQLInt),
                //     description: 'Video duration.'
                // },
                // watched: {
                //     type: new GraphQLNonNull(GraphQLBoolean),
                //     description: 'Video watched or not.'
                // },
                video: {
                    type: new GraphQLNonNull(videoInputType),
                },
            },
            resolve: (_, args) => {
                return createVideo(args.video);
            },
        },
    },
});

const queryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root of query Type',
    fields: {
        node: nodeField,
        videos: {
            // type: new GraphQLList(videoType),
            // resolve: getVideos
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
            // resolve: () => new Promise((resolve) => {
            //     resolve({
            //         id: () => '2',
            //         title: () => 'Roshan',
            //         duration: () => 360,
            //         watched: () => false,
            //     })
            // })
            resolve: (_, args) => {
                return getVideoById(args.id);
            },
        },
    },
});

const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
    // subscription
})

// const schema = buildSchema(`
// type Video{
//     id:ID,
//     title: String,
//     duration: Int,
//     watched: Boolean
// }
// type Query{
//  video: Video
//  videos: [Video]
// }
// type Schema{
//     query: Query
// }
// `);

// const resolvers = {
//     video: () => ({
//         id: () => '1',
//         title: () => 'bar',
//         duration: () => 180,
//         watched: () => true,
//     }),
//     videos: () => videos,
// }

// const query = `
// query myFirstQuery {
// videos{    
//     id,
//     title,
//     duration,
//     watched
// }
// }
// `;

// graphql(schema, query, resolvers)
//     .then((result) => console.log(result))
//     .catch((error) => console.log(error));

server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
    //rootValue: resolvers,
}));
server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})