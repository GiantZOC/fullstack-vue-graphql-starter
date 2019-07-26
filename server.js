const {ApolloServer, gql} = require('apollo-server');

const todos = [
 {task: 'Wash car', completed:false},
 {task: 'Clean room', completed:true},
]

const typeDefs = gql`
    type Todo {
        task: String
        completed: Boolean
    }

    type Query {
        getTodos: [Todo]
    }

    type Mutation {
        addTodo(task: String, completed: Boolean)
    }
`;

const resolvers = {
    Query: {
        getTodoes: () => todos
    },
    Mutation: {
        addTodo: (_, {task, completed}) => {
            const todo = {task, completed};
            todos.push(todo);
            return todo;
        }
    }
}

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers
});

//initialize server
server.listen().then(({ url }) => {
    console.log(`Server listening on ${url}`);
});
