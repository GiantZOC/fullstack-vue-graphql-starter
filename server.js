const {ApolloServer, gql} = require('apollo-server');
const mongoose = require('mongoose');

require('dotenv').config();
const User = require('./models/User');
const Post = require('./models/Post');

console.log(process.env.MONGO_URI)
mongoose
.connect(process.env.MONGO_URI, {useNewUrlParser: true})
.then(() => console.log('DB connected'))
.catch(err => console.error(err));

const typeDefs = gql`
    type Todo {
        task: String
        completed: Boolean
    }

    type Query {
        getTodos: [Todo]
    }

`;


const server = new ApolloServer({
    typeDefs: typeDefs,
    context: {
        User,
        Post
    }
});

//initialize server
server.listen().then(({ url }) => {
    console.log(`Server listening on ${url}`);
});
