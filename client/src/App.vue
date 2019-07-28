<template>
  <v-app>
     <v-app-bar app>


      <v-toolbar fixed color="primary" dark>
      <v-toolbar-side-icon></v-toolbar-side-icon>
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
    }
  },
  data: () => ({
    //
  }),
};
</script>
