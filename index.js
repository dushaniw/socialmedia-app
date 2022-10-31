const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');

const { MONGODB } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/'); // since its inside index.js, we do not need to explicity say it

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }) //forward request from express to apollo server resolvers
});

mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to MongoDB...')
        return server.listen({ port: 5000 })
    }).then(res => {
        console.log(`Server runnning at ${res.url}`)
    });