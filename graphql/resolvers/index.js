const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {  //combine both post and users resolvers
    //modifiers
    Post: {
        likeCount(parent) {
            return parent.likes.length;
        },
        commentCount(parent) {
            return parent.comments.length;
        }
    },
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation,
    }
}