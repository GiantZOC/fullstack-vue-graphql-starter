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

      <v-text-field flex prepend-icon="mdi-magnify" placeholder="Search posts" color="accent" single-line-hide-details></v-text-field>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-xs-only" color="primary">
        <v-btn depressed text  v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
          <v-icon class="hidden-sm-only" left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>

        <!-- Profile Button -->
        <v-btn depressed text to="/profile" v-if="user">
          <v-icon  class="hidden-sm-only" left>mdi-face</v-icon>
          <v-badge right color="blue darken-2">
            <!-- <span slot="badge">1</span> -->
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
import {mapGetters, mapState} from 'vuex';

export default {
  name: 'App',
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
    }
  },
  computed:{
    ...mapState(['user', 'authError']),
    ...mapGetters['user', 'authError'],
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
  data() {
    return {
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false
    }
  },
  methods: {
    handleSignoutUser(){
      this.$store.dispatch('signoutUser');
    },
    toggleSideNav(){
      this.sideNav = !this.sideNav;
    },
    
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
</style>
