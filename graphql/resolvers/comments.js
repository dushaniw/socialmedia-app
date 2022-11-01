const { UserInputError, AuthenticationError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Mutation: {
        async createComment(_parent, { postId, body }, context) {
            const { username } = checkAuth(context);
            const errors = {};
            if (body.trim() === '') {
                errors.body = 'Comment body must not be empty';
                throw new UserInputError('Empty Comment', errors);
            }
            const post = await Post.findById(postId);
            if (post) {
                post.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                });
                await post.save();
                return post;
            } else {
                errors.postId = 'Post Id not found';
                throw new UserInputError('Post not found', errors);
            }
        },
        deleteComment: async (_parent, { postId, commentId }, context) => {
            const { username } = checkAuth(context);
            const post = await Post.findById(postId);
            if (post) {
                const commentIndex = post.comments.findIndex(comment => comment.id === commentId);
                if (!post.comments[commentIndex]) {
                    throw new UserInputError('Comment not found');
                }
                if (post.comments[commentIndex].username === username) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError("Action not allowed");
                }
            } else {
                throw new UserInputError('Post not found');
            }
        }
    }
}