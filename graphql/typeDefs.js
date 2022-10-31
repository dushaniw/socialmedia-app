const { gql } = require('apollo-server');

module.exports = gql`
    type Post {
        id : ID!,
        body : String!,
        createdAt : String!,
        username : String!,
        comments : [Comment]!,
        likes : [Like]!
    },
    input RegisterInput {
        username : String!,
        password: String!,
        confirmPassword: String!,
        email: String!
    },
    type User {
        id: ID!,
        username: String!,
        email: String!,
        token: String!,
        createdAt: String!,
    },
    type Comment {
        id: ID!,
        createdAt: String!,
        username: String!,
        body: String!
    },
    type Like {
        id: ID!,
        createdAt: String!,
        username: String!
    }
    type Query  {
        getPosts : [Post]
        getPost (postId : ID!) : Post
    },
    type Mutation {
        register (registerInput : RegisterInput) : User!
        login (username: String!, password: String!) : User!
        createPost(body: String) : Post!
        deletePost(postId : ID!) : String !
        createComment(postId: ID!, body: String!) : Post!
        deleteComment(postId: ID!, commentId: ID!) : Post!
        likePost(postId: ID!): Post!
    }       
`;