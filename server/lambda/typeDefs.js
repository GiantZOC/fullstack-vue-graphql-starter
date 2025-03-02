const {gql} = require('apollo-server-lambda');

export const typeDefs = gql`type User {
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
`