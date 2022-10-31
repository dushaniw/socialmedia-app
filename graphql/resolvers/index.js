const postsResolvers = require('./posts');
const usersResolvers = require('./users');

module.exports = {  //combine both post and users resolvers
    Query : {
        ...postsResolvers.Query
    },
    Mutation : {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation
    }
}