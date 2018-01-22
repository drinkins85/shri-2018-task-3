const GraphQLDate = require('graphql-date');

const query = require('./query');
const mutation = require('./mutation');

const { models } = require('../../models');

module.exports = function resolvers () {
    return {
        Query: query,
        Mutation: mutation,
        Event: {
            users(event) {
                return event.getUsers(); // добавлен return
            },
            room(event) {
                return event.getRoom(); // добавлен return
            }
        },
        Date: GraphQLDate
    };
};
