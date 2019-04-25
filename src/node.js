'use strict';

const {
    GraphQLInterfaceType,
    GraphQLNonNull,
    GraphQLID
} = require('graphql');

const {videoType} = require('../src');

const nodeInterface = new GraphQLInterfaceType({
    name: 'Node',
    fields: {
        id:{
            type: new GraphQLNonNull(GraphQLID),
        },
    },
    resolveType: (object) => {
        if(object.type){
            return videoType;
        }
        return null;
    },
});

exports.nodeInterface = nodeInterface; 