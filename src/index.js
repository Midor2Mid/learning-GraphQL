'use strict';

const { graphql, buildSchema } = require('graphql');
const schema = buildSchema(`
type Video{
    id:ID,
    title: String,
    duration: Int,
    watched: Boolean
}
type Query{
 video: Video
 videos: [Video]
}
type Schema{
    query: Query
}
`);

const videoA = {
    id: () => '1',
        title: () => 'Barron',
        duration: () => 180,
        watched: () => true,
}

const videoB = {
    id: () => '2',
        title: () => 'Roshan',
        duration: () => 360,
        watched: () => false,
}

const videos = [videoA, videoB];

const resolvers = {
    video: () => ({
        id: () => '1',
        title: () => 'bar',
        duration: () => 180,
        watched: () => true,
    }),
    videos: () => videos,
}

const query = `
query myFirstQuery {
videos{    
    id,
    title,
    duration,
    watched
}
}
`;

graphql(schema, query, resolvers)
    .then((result) => console.log(result))
    .catch((error) => console.log(error));