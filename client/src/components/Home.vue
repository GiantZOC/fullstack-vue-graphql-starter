<template>
  <div>
    <h1>Home</h1>
    <v-btn color="primary">Button</v-btn>
    <ul v-for="post in getPosts" :key="post._id">
      <li>
        {{post.title}}
        {{post.imageUrl}}
        {{post.descripton}}
      </li>
      <li>
        {{post.likes}}
      </li>
    </ul>
  </div>
</template>

<script>
import {gql} from 'apollo-boost';

export default{
   name: "home",
   apollo: {
     getPosts:{
       query: gql`
          query{
            getPosts{
          _id,
          title,
          imageUrl,
          description
          }
         }
       `
     }
   }
 }

</script>