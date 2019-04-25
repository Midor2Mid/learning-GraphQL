'use strict';

const {
nodeDefinitions,
fromGlobalId,
} = require('graphql-relay');

const { getObjectById } = require('./data');

const { nodeInterface, nodeField } = nodeDefinitions(
    (globalID) => {
        const { type, id } = fromGlobalId(globalID);
        return getObjectById(type.toLowerCase(), id);
    },
    (object) => {
        const { videoType } = require('../');
        if(object.title){
            return videoType;
        }
        return null;
    },
);

exports.nodeInterface = nodeInterface; 
exports.nodeField = nodeField; 