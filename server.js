const {ApolloServer} = require('apollo-server');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// import typedefa and resolvers
const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require("./resolvers");

console.log(typeDefs);

// import environment variable and models
require('dotenv').config();
const User = require('./models/User');
const Post = require('./models/Post');

console.log(process.env.MONGO_URI)

//connect to MLab MongoDB
mongoose
.connect(process.env.MONGO_URI, {useNewUrlParser: true})
.then(() => console.log('DB connected'))
.catch(err => console.error(err));

// Create Apollo/GraphQl Server
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers,
    context: {
        User,
        Post
    }
});

//initialize server
server.listen().then(({ url }) => {
    console.log(`Server listening on ${url}`);
});
