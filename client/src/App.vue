<template>
  <v-app style="background: #E3E3EE">
     <v-app-bar app>
      <v-navigation-drawer app temporary fixed v-model="sideNav">
        <v-toolbar color="accent" dark flat>
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
        <v-btn depressed class="v-btn--flat" v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
          <v-icon class="hidden-sm-only" left>{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>
        <!-- <v-btn flat>
          Posts
        </v-btn>
           -->
      </v-toolbar-items>

      </v-toolbar>

      <!-- <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn> -->
     </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  computed:{
    horizontalNavItems(){
      return[
        { icon: 'mdi-chat', title: 'Posts', link: '/posts'},
        {icon: 'mdi-login', title: 'Sign In', link: '/signin'},
        {icon: 'mdi-account', title: 'Sign Up', link: '/signup'}
      ]
    },
    sideNavItems(){ 
      return[
        { icon: 'mdi-chat', title: 'Posts', link: '/posts'},
        {icon: 'mdi-login', title: 'Sign In', link: '/signin'},
        {icon: 'mdi-account', title: 'Sign Up', link: '/signup'}
      ]
    }
  },
  data() {
    return {
      sideNav: false
    }
  },
  methods: {
    toggleSideNav(){
      this.sideNav = !this.sideNav;
    }
  }
};
</script>
