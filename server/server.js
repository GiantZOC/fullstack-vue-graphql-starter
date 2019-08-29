const {ApolloServer} = require('apollo-server');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// import typedefa and resolvers
const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require("./resolvers");
const jwt = require("jsonwebtoken");

// import environment variable and models
require('dotenv').config();
const User = require('./models/User');
const Post = require('./models/Post');

console.log(process.env.mongo_uri)

//connect to MLab MongoDB
mongoose
.connect(process.env.mongo_uri, {useNewUrlParser: true})
.then(() => console.log('DB connected'))
.catch(err => console.error(err));

//Verify JWT Token
const getUser = async token =>{
    if(token){
        try {
            return await jwt.verify(token, process.env.secret);
            //console.log(user);
        } catch (error) {
            //throw new AuthenticationError('Your session has ended.  Please sign in again.');
            console.error(error);
        }
    }
}

// Create Apollo/GraphQl Server
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers,
    formatError: (error) => {
        return {name: error.name, message: error.message.replace('Context creation failed:', '')};
    },
    context: async ({req}) => {
        const token = req.headers["authorization"];
        return {User, Post, currentUser: await getUser(token)}; 
    }
});

//initialize server
server.listen({port: process.env.port || 4000}).then(({ url }) => {
    console.log(`Server listening on ${url}`);
});
