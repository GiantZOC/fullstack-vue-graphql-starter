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
                <div class="headling">{{user.username}}</div>
                <div>Joined {{formatJoinDate(user.joinDate)}}</div>
                <div class="hidden-xs-only font-weight-regular">{{user.favorites.length}} Favorites</div>
                <div class="hidden-xs-only font-weight-regular">{{userPosts.length}} Posts Added</div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
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
            <v-card-text>{{favorite.title}}</v-card-text>
            <v-img @click="goToPost(favorite._id)" height="30vh" :src="favorite.imageUrl"></v-img>
            
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Posts created by user -->
    <v-container v-if="!userPosts.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>You have no posts currently. Go and add some</h2>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-light">
          Your Posts
          <span class="font-weight-regular">{{userPosts.length}}</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
          <v-card class="mt03 ml-1 mr-2" hover>
            <v-card-text>{{post.title}}</v-card-text>
            <v-btn @click="loadPost(post)" color="info" floating fab small dark>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn @click="handleDeleteUserPost(post)" color="error" floating fab small dark>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-img @click="goToPost(post._id)" height="30vh" :src="post.imageUrl"></v-img>
            
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- edit post dialog -->
    <v-dialog xs12 sm6 offset-sm3 presistent v-model="editPostDialog">
      <v-card>
        <v-card-title class="headline grey lighten-2">Update Post</v-card-title>
        <v-card-text>
          <v-container>
        <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleUpdateUserPost">
                            <!-- titleinput -->
                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field :rules="titleRules" flex v-model="title" label="Post Title" type="text" required></v-text-field>
                                </v-flex>
                            </v-layout>
                            <!-- image url -->
                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field  :rules="imageRules" flex v-model="imageUrl" label="Image URL" type="text" required></v-text-field>
                                </v-flex>
                            </v-layout>

                             <!-- image preview -->
                            <v-layout v-if="imageUrl" row>
                                <v-flex xs12>
                                    <img :src="imageUrl" height="300px">
                                </v-flex>
                            </v-layout>

                             <!-- categories select-->
                            <v-layout row>
                                <v-flex xs12>
                                    <v-select :rules="categoriesRules"  v-model="categories" :items="['Art', 'Education', 'Travel', 'Photography', 'Technology']" multiple label="Categories"></v-select>
                                </v-flex>
                            </v-layout>

                             <!-- description-->
                            <v-layout row>
                                <v-flex xs12>
                                    <v-textarea :rules="descRules" v-model="description" label="Description" type="text" required></v-textarea>
                                </v-flex>
                            </v-layout>
                            
                            <v-divider></v-divider>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn :disabled="!isFormValid" type="submit" class="success-text" text>Update</v-btn>
                              <v-btn class="error--text" text @click="editPostDialog=false">Cancel</v-btn>
                            </v-card-actions>
                        </v-form>
                        </v-container>
                        </v-card-text>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

export default {
  name: "Profile",
  data(){
    return{
      editPostDialog: false,
      isFormValid: true,
      title: '',
            imageUrl: '',
            categories: [],
            description: '',
            titleRules: [
                title => !!title || 'Title is required',
                title => title.length < 20 || 'Title must have less than 20 characters'
            ],
            imageRules: [
                imageUrl => !!imageUrl || 'Image is required'
            ],
            categoriesRules: [
                categories => categories.length >= 1 || 'At least one category is required'
            ],
            descRules: [
                description => !!description || 'Description is required',
                description => description.length < 20 || 'Description must have less than 20 characters'
            ],
    }
  },
  computed: {
    ...mapGetters(["user", "userFavorites", "userPosts"])
  },
  created(){
    this.handleGetUserPosts();
  },
  methods:{
    goToPost(id){
      this.$router.push(`/posts/${id}`);
    },
    formatJoinDate(date){
      return moment(new Date(date)).format('ll');
    },
    handleGetUserPosts(){
      this.$store.dispatch('getUserPosts',{
        userId: this.user._id
      });
    },
    handleUpdateUserPost(){
      if(this.$refs.form.validate()){
        //update user post action
        this.$store.dispatch('updateUserPost', {
          postId: this.postId,
          userId: this.user._id,
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description
        })
        this.editPostDialog = false;
      }
    },
    loadPost({_id, title, imageUrl, categories, description}, editPostDialog = true){
      this.editPostDialog = editPostDialog;
      this.postId = _id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.categories = categories;
      this.description = description;
    },
    handleDeleteUserPost(post){
      this.loadPost(post, false);
      const deletePost = window.confirm('Are you sure you want to delete this post?');
      if(deletePost){
        this.$store.dispatch('deleteUserPost', {
          postId: this.postId
        })
      }
    }
  }
};
</script>

<style>
</style>
