<template>
  <div>
    <h1>Home</h1>
    <v-btn color="primary">Button</v-btn>
    <div v-if="$apollo.loading">Loading...</div>
    <ul v-else v-for="post in getPosts" :key="post._id">
      <li>
        {{post.title}}
        {{post.imageUrl}}
        {{post.descripton}}
      </li>
      <li>{{post.likes}}</li>
    </ul>
  </div>
</template>

<script>
import { gql } from "apollo-boost";

export default {
  name: "home",
  data(){
    return{
      posts: []
    }
  },
  apollo: {
    getPosts: {
      query: gql`
        query {
          getPosts {
            _id
            title
            imageUrl
            description
          }
        }
      `,
      result(args){ //{data, loading, networkStatus}
        // if(!loading){
        //   this.posts = data.getPosts
        //   console.log('[networkStatus]', networkStatus)
        // }
        console.dir(args);
      },
      error(err){
        console.error('[ERROR!!]', err);
        console.dir(err);
      }
    }
  }
};
</script>