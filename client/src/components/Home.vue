<template>
  <v-container text-xs-center>
    <!-- loading spinner -->
    <v-layout row>
      <v-dialog v-model="loading" persistent fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular inderterminate :size="70" :width="7" color="secondary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <!-- explore posts button -->
    <v-layout align-center justify-center class="mt-2 mb-3" v-if="!loading">
        <v-btn xs12 center class="secondary" to="/posts" large dark>
        Explore Posts
        </v-btn>
    </v-layout>

    <!-- carousel -->
    <v-flex xs12>
      <v-carousel v-if="!loading && posts.length > 0" v-bind="{'cycle': true }" interval="3000">
        <v-carousel-item @click.native="goToPost(post._id)" v-for="post in posts" :key="post._id" :src="post.imageUrl">
          <h1 id="carousel__title">{{post.title}}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: "home",
  created(){
    this.handleGetCarouselPosts();
  },
  computed: {
    ...mapGetters(['loading', 'posts'])
    // posts(){
    //   return this.$store.getters.posts;
    // },
    // loading(){
    //   return this.$store.getters.loading;
    // }
  },
  methods: {
    handleGetCarouselPosts(){
      //get posts from vuex store
      this.$store.dispatch('getPosts');
    },
    goToPost(postId){
      this.$router.push(`/posts/${postId}`);
    }
  }
};
</script>

<style>
#carousel__title{
  position: absolute;
  cursor: pointer;
  background-color: rgba(0,0,0, .5);
  color: white;
  border-radius: 5px 5px 0 0;
  padding: .5em;
  margin: 0 auto;
  bottom:50px;
  left: 0;
  right: 0;
}
</style>