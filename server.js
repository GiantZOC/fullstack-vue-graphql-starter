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

console.log(process.env.MONGO_URI)

//connect to MLab MongoDB
mongoose
.connect(process.env.MONGO_URI, {useNewUrlParser: true})
.then(() => console.log('DB connected'))
.catch(err => console.error(err));

//Verify JWT Token
const getUser = async token =>{
    if(token){
        try {
            let user = await jwt.verify(token, process.env.SECRET);
            console.log(user);
        } catch (error) {
            console.error(error);
        }
    }
}

// Create Apollo/GraphQl Server
const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers,
    context: ({req}) => {
        const token = req.headers["authorization"];
        return {User, Post, currentUser: getUser(token)}; 
    }
});

//initialize server
server.listen().then(({ url }) => {
    console.log(`Server listening on ${url}`);
});
