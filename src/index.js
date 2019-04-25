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
    GraphQLNonNull
} = require('graphql');

const {getVideoById, getVideos} = require('./data')

const PORT = process.env.PORT || 3000
const server = express();

const videoType = new GraphQLObjectType({
    name: 'Video',
    description: 'A video',
    fields: {
        id: {
            type: GraphQLID,
            description: 'Video ID.'
        },
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
});

const queryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root of query Type',
    fields: {
        videos:{
            type: new GraphQLList(videoType),
            resolve: getVideos
        },
        video: {
            type: videoType,
            args:{
                id:{
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
    // mutation,
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