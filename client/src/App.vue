<template>
  <v-app style="background: #E3E3EE">
     <v-app-bar app>

       <!-- vertical navbar drawer -->
      <v-navigation-drawer app temporary fixed v-model="sideNav">
        <v-toolbar color="accent" dark text>
          <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
          <router-link to="/" tag="span" style="cursor: pointer">
           <h1 class="title pl-3">VueShare</h1>
          </router-link>
        </v-toolbar>

        <v-divider></v-divider>

        <v-list>
          <v-list-item v-for="item in sideNavItems" :key="item.title" :to="item.link">
            <v-list-item-icon>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              {{item.title}}
            </v-list-item-content>
          </v-list-item>

          <!-- Profile -->
          <v-list-item v-if="user" to="./profile">
            <v-list-item-icon>
              <v-icon>mdi-face</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              Profile       
            </v-list-item-content>
          </v-list-item>

          <!-- signout -->
          <v-list-item v-if="user" @click="handleSignoutUser">
            <v-list-item-icon>
              <v-icon>mdi-exit-to-app</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              Signout
            </v-list-item-content>
          </v-list-item>
        </v-list>
        
      </v-navigation-drawer>
      
      <!-- Horizontal navbar -->
      <v-toolbar fixed color="primary" dark>
      <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>

      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor: pointer">
        VueShare
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <!-- Search -->
      <v-text-field v-model="searchTerm" @input="handleSearchPosts" flex prepend-icon="mdi-magnify" placeholder="Search posts" color="accent" single-line-hide-details></v-text-field>

      <!-- Search Results -->
      <v-card dark v-if="searchResults" id="search__card">
        <v-list>
          <v-list-item @click="goToSearchResult(result._id)" v-for="result in searchResults" :key="result._id">
            <!-- show icon if favorited by user -->
            <v-list-item-icon v-if="checkIfUserFavorite(result._id)">
              <v-icon>mdi-heart</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              {{result.title}}
              <span class="font-weight-thin">{{formatDescription(result.description)}}</span> 
            </v-list-item-content>
            
          </v-list-item>
        </v-list>
      </v-card>
<!-- <v-icon large :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'">mdi-heart</v-icon> -->

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-xs-only" color="primary">
        <v-btn depressed text  v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
          <v-icon class="hidden-sm-only" left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>

        <!-- Profile Button -->
        <v-btn depressed text to="/profile" v-if="user">
          <v-icon  class="hidden-sm-only" left>mdi-face</v-icon>
          <v-badge right color="pink darken-2" :class="{ 'bounce': badgeAnimated}">
            <template v-slot:badge>
              <span slot="badge" v-if="userFavorites.length"> {{userFavorites.length}}</span>
            </template>
            Profile
          </v-badge>
        </v-btn>

        <!-- Signout Button -->
        <v-btn depressed text v-if="user"  @click="handleSignoutUser">
          <v-icon class="hidden-sm-only" left>mdi-exit-to-app</v-icon>
          Signout
        </v-btn>
      </v-toolbar-items>

      </v-toolbar>
     </v-app-bar>

    <v-content>
      <transition name="fade">
        <router-view/>
      </transition>

      <v-snackbar v-model="authSnackbar" color="success" :timeout="3000" bottom left>
        <v-icon class="mr-3">mdi-check</v-icon>
        <h3>You are now signed in! </h3>
        <v-btn dark text @click="authSnackbar = false">Close</v-btn>
      </v-snackbar>

      <v-snackbar v-if="authError" v-model="authErrorSnackbar" color="warning" :timeout="3000" bottom left>
        <v-icon class="mr-3">mdi-cancel</v-icon>
        <h3>{{authError.message}}</h3>
        <v-btn dark text to="/signin">Signin</v-btn>
      </v-snackbar>
    </v-content>
  </v-app>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'App',
  data() {
    return {
      searchTerm: '',
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      badgeAnimated: false
    }
  },
  watch: {
    user(newValue, oldValue){
      //if we had no value for user before, show snackbar
      if(oldValue === null){
        this.authSnackbar = true;
      }
    },
    authError(value){
      //if autherror show the snackbar
      if(value !== null){
        this.authErrorSnackbar = true;
      } 
    },
    userFavorites(value){
      //if user favorites value changes
      if(value){
        this.badgeAnimated = true;
        setTimeout(()=> (this.badgeAnimated = false), 1000);
      }
    }
  },
  computed:{
    //...mapState(['user', 'authError', 'userFavorites']),
    ...mapGetters(['user', 'authError', 'userFavorites', 'searchResults']),
    horizontalNavItems(){
      let items = [
        { icon: 'mdi-chat', title: 'Posts', link: '/posts'},
        {icon: 'mdi-login', title: 'Sign In', link: '/signin'},
        {icon: 'mdi-account', title: 'Sign Up', link: '/signup'}
      ];
      //user not null
      if(this.user){
        items = [
          { icon: 'mdi-chat', title: 'Posts', link: '/posts'},
        ];
      }
      return items;
    },
    sideNavItems(){ 
      let items = [
        { icon: 'mdi-chat', title: 'Posts', link: '/posts'},
        {icon: 'mdi-login', title: 'Sign In', link: '/signin'},
        {icon: 'mdi-account', title: 'Sign Up', link: '/signup'}
      ];
      //user not null
      if(this.user){
        items = [
          { icon: 'mdi-chat', title: 'Posts', link: '/posts'},
          { icon: 'mdi-star', title: 'Create Post', link: '/post/add'},
          // { icon: 'mdi-account', title: 'Profile', link: '/profile'},
          // { icon: 'mdi-exit-to-app', title: 'Signout', link: '/signout'},
        ];
      }
      return items;
    }
  },
  methods: {
    handleSignoutUser(){
      this.$store.dispatch('signoutUser');
    },
    toggleSideNav(){
      this.sideNav = !this.sideNav;
    },
    handleSearchPosts(){
      this.$store.dispatch('searchPosts',{
        searchTerm: this.searchTerm
      })
    },
    goToSearchResult(resultId){
      // clear search term
      this.searchTerm = '';
      // go to desired result
      this.$router.push(`/posts/${resultId}`);
      // clear search results
      this.$store.commit('clearSearchResults');
    },
    formatDescription(description){
      return description.length > 20 ? `${description.slice(0,20)}...` : description;
    },
    checkIfUserFavorite(resultId){
      return this.userFavorites && this.userFavorites.some(fave => fave._id === resultId);
    }
    
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active{
  transition-property: opacity;
  transition-duration: .25s;
}

.fade-enter-active{
  transition-delay: .25s;
}

.fade-enter,
.fade-leave-active{
  opacity: 0;
}

/* User favorite animation */
.bounce{
  animation: bounce 1s both;
}

@keyframes bounce{
  0%, 20%, 53%, 80%, 100%{
    transform: translate3d(0,0,0);
  }
  40%, 43%{
    transform: translate3d(0, -20px, 0);
  }
  70%{
    transform: translate3d(0, -10px, 0);
  }
  90%{
    transform: translate3d(0, -4px, 0);
  }
}

/* search results card */
#search__card{
  position: absolute;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%;
}
</style>
