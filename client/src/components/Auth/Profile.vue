<template>
  <v-container class="text-xs-center">
    <!-- user details -->
    <v-flex sm6 offset-sm3>
      <v-card class="white--text" color="secondary">
        <v-layout>
          <v-card dark>
            <v-list-item three-line>
              <v-list-item-avatar size="125" tile>
                <v-img :src="user.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-content class="align-self-start">
                <!-- <v-list-item-title
                  class="headline mb-2"
                  v-text="item.title"
                ></v-list-item-title>

                <v-list-item-subtitle v-text="item.artist"></v-list-item-subtitle>-->
                <div class="headling">{{user.username}}</div>
                <div>Joined {{user.joinDate}}</div>
                <div class="hidden-xs-only font-weight-regular">{{user.favorites.length}} Favorites</div>
                <div class="hidden-xs-only font-weight-regular">2 Posts Added</div>
              </v-list-item-content>
            </v-list-item>
          </v-card>

          <!-- posts favorited by user -->
          <!-- <v-layout row wrap v-if="!userFavorites.length">
            <v-flex xs12>
              <h2>You have no favorites currently.  Go and add some</h2>
            </v-flex>
          </v-layout>
          <v-container class="mt-3" v-else>
            <v-flex xs12>
              <h2 class="font-weight-light">Favorited
                <span class="font-weight-regular">{{userFavorites.length}}</span>
              </h2>

            </v-flex>
            <v-layout row wrap>
              <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
                <v-card class="mt-3 ml-1 mr-2" hover>
                  <v-img height="30vh" :src="favorite.imageUrl"></v-img>
                  <v-card-text>{{favorite.title}}</v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container> -->

          <!-- <v-flex xs5>
            <v-card height="125px" contain >
                <v-card-title>
                <v-img :src="user.avatar" alt=""></v-img>
                </v-card-title>
            </v-card>
          </v-flex>
          <v-flex xs7>
            <v-card-title>
              <div>
                
              </div>
            </v-card-title>
          </v-flex>-->
        </v-layout>
      </v-card>
    </v-flex>

    <!-- Posts favorited by user -->
    <v-container v-if="!userFavorites.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You have no favorites currently. Go and add some</h2>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">
          Favorited
          <span class="font-weight-regular">{{userFavorites.length}}</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
          <v-card class="mt03 ml-1 mr-2" hover>
            <v-img height="30vh" :src="favorite.imageUrl"></v-img>
            <v-card-text>{{favorite.title}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  computed: {
    ...mapGetters(["user", "userFavorites"])
  }
};
</script>

<style>
</style>
