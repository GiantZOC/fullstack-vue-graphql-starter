Working project from fullstack vue graphql tutorial.

start the server

npm run server

# Write your query or mutation here
mutation{
  signinUser(username: "Doug", password: "doug"){
    token
  }
}

# Write your query or mutation here
mutation{
  signupUser(username: "Doug", email: "doug@gmail.com", password: "doug"){
    username
    email
    password
    avatar
    joinDate
  }
}

Edit typeDefs, edit resolvers, edit queries, edit store, edit component