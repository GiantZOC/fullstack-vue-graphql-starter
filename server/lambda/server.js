const {ApolloServer, gql} = require('apollo-server-lambda');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// import typedefa and resolvers
const typeDefs = gql`
type User {
    _id: ID
    username: String! @unique
    email: String!
    password: String!
    avatar: String
    joinDate: String
    favorites: [Post]
  }
  
  type Post {
    _id: ID
    title: String!
    imageUrl: String!
    categories: [String]!
    description: String!
    createdDate: String
    likes: Int
    createdBy: User!
    messages: [Message]
  }
  
  type Message {
    _id: ID
    messageBody: String!
    messageDate: String
    messageUser: User!
  }
  
  # Likes for Post / Favorites for User
  type LikesFaves {
    likes: Int
    favorites: [Post]
  }
  
  type Token {
    token: String!
  }
  
  type PostsPage {
    posts: [Post]
    hasMore: Boolean
  }
  
  type Query {
    getCurrentUser: User
    getPosts: [Post]
    getPost(postId: ID!): Post!
    getUserPosts(userId: ID!) : [Post]
    searchPosts(searchTerm: String): [Post]
    infiniteScrollPosts(pageNum: Int!, pageSize: Int!): PostsPage
  }
  
  type Mutation {
    addPost(
      title: String!
      imageUrl: String!
      categories: [String]!
      description: String!
      creatorId: ID!
    ): Post!
    addPostMessage(messageBody: String!, userId: ID!, postId: ID!): Message!
    updateUserPost(postId: ID!, userId: ID!, title: String!, imageUrl: String!, categories: [String]!, description: String!): Post!
    deleteUserPost(postId: ID!): Post!
    likePost(postId: ID!, username: String!): LikesFaves!
    unlikePost(postId: ID!, username: String!): LikesFaves!
    signinUser(username: String!, password: String!): Token!
    signupUser(username: String!, email: String!, password: String!): Token!
  }
`;
const resolvers = require("./resolvers");
const jwt = require("jsonwebtoken");

// import environment variable and models
require('dotenv').config();
const User = require('./User');
const Post = require('./Post');

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
    // context: ({ event, context }) => ({
    //     headers: event.headers,
    //     functionName: context.functionName,
    //     event,
    //     context,
    //   }),
    context: async ({event, context}) => {
        const token = event.headers["authorization"];
        return {User, Post, currentUser: await getUser(token)}; 
    },
    playground: true,
    introspection: true
    
});

//exports.handler = server.createHandler();

// cors
exports.handler = server.createHandler({
    cors: {
      origin: '*',
      credentials: true,
    },
  });

//initialize server
// server.listen({port: process.env.port || 4000}).then(({ url }) => {
//     console.log(`Server listening on ${url}`);
// });
