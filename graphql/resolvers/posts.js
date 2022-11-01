const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        async getPosts() { //async database call
            try {
                const posts = await Post.find().sort({ createdAt: -1 }); // mongoose method to find documents from mongodb collection Post
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPost(_parent, { postId }) {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_parent, { body }, context) {
            const user = checkAuth(context); //get loggedin user details from the authorization header
            if (body.trim() === '') {
                throw new UserInputError('Post body must not be empty');
            }
            const newPost = new Post({
                body,
                username: user.username,    
                user: user.id,
                createdAt: new Date().toISOString()
            });
            const createdPost = await newPost.save();
            return createdPost;
        },
        async deletePost(_parent, { postId }, context) {
            const user = checkAuth(context); //validate token
            try {
                const post = await Post.findById(postId);
                if (!post) {
                    return new UserInputError('Post not found');
                }
                if (user.username === post.username) { //only loggedin user can delete their own post
                    await post.delete();
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        likePost : async(_parent, { postId }, context) => {
            const { username } = checkAuth(context);
            try {
                const post = await Post.findById(postId);
                if (!post) {
                    return new UserInputError('Post not found');
                }
                //if post already liked, unlike it
                if (post.likes.find(like => like.username === username)) {
                    post.likes = post.likes.filter(like => like.username !== username);             
                } else {
                    post.likes.push({ 
                        username, 
                        createdAt: new Date().toISOString()
                    });
                }
                await post.save();
                return post;
            } catch (err) {
                throw new Error(err);
            }
        }
    }
};