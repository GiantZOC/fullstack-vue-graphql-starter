<template>
    <v-container v-if="getPost" class="mt-3" flexbox center>
        <!-- Post Card -->
        <v-layout row wrap>
            <v-flex xs12>
                <v-card hover>
                    <v-card-title>
                        <h1>
                            {{getPost.title}}
                        </h1>
                        <v-btn @click="handleToggleLike" large icon v-if="user">
                            <v-icon large :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'">mdi-heart</v-icon>
                        </v-btn>
                        <h3 class="ml-3 font-weight-thin">{{getPost.likes}} LIKES</h3>
                    
                        <v-spacer></v-spacer>
                        <v-icon @click="goToPreviousPage" color="info" large>mdi-arrow-left</v-icon>
                    </v-card-title>
                    <v-tooltip right>
                        <span>
                            Click to enlarge image
                        </span>
                        
                        <!-- <v-card-media slot="activator" :src="getPost.imageUrl" ></v-card-media> -->
                    </v-tooltip>
                    <v-img id="post__image"  @click="toggleImageDialog" :src="getPost.imageUrl" height="80vh"></v-img>
                    <!-- Enlarged media -->
                    <v-dialog v-model="dialog" >
                        <v-card @click="toggleImageDialog">
                            <v-img :src="getPost.imageUrl" height="80vh"></v-img>
                            <!-- <v-card-media :src="getPost.imageUrl" >

                            </v-card-media> -->
                        </v-card>
                    </v-dialog>

                    <v-card-text>
                        <span v-for="(category, index) in getPost.categories" :key="index">
                            <v-chip class="mb-3" color="accent" text-color="white">{{category}} </v-chip>

                        </span>
                        <h3>{{getPost.description}}</h3>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
        <!-- messages section -->
        <div class="mt-3">
            <v-layout class="mb-3" v-if="user">
                <v-flex class="xs12">
                    <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleAddPostMessage">
                        <v-layout row>
                            <v-flex class="xs12">
                                <v-text-field :rules="messageRules" v-model="messageBody" clearable :append-outer-icon="messageBody && 'mdi-send'" label="Add Message" type="text" @click:append-outer="handleAddPostMessage" prepend-icon="mdi-email" required></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-flex>
            </v-layout>
        </div>
        <!-- messages -->
        <v-layout row wrap>
            <v-flex class="xs12">
                <v-list subheader two-line>
                    <v-subheader>Messages ({{getPost.messages.length}})</v-subheader>
                    <template v-for="message in getPost.messages">
                        <v-divider :key="message._id"></v-divider>
                        <v-list-item :key="message.title">
                            <v-list-item-avatar>
                                <v-img :src="message.messageUser.avatar" alt=""></v-img>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title>
                                    {{message.messageBody}}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{message.messageUser.username}}
                                    <span class="grey--text text--lighten-1 hidden-xs-only">{{getTimeFromNow(message.messageDate)}}</span>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            
                            <v-list-item-action class='hidden-xs-only'>
                                <v-icon :color="checkIfOwnMessage(message) ? ' accent' : 'grey'">mdi-chat</v-icon>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                </v-list>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import {GET_POST, ADD_POST_MESSAGE, LIKE_POST, UNLIKE_POST} from '../../queries';
import {mapGetters} from 'vuex';
import moment from 'moment';

export default {
    name: "Post",
    props: ['postId'],
    data(){
        return {
            dialog: false,
            messageBody: '',
            postLiked: false,
            isFormValid: true,
            messageRules: [
                message => !!message || 'Message is required',
                message => message.length < 50 || 'Message must be less than 50 charactes'
            ]
        } 
    },
    apollo:{
        getPost:{
            query: GET_POST,
            variables(){
                return {
                    postId: this.postId
                }
            }
        }
    },
    computed:
    {
        ...mapGetters(['user', 'userFavorites'])
    },
    methods:{
        getTimeFromNow(time){
            return moment(new Date(time)).fromNow();
        },
        checkIfPostLiked(postId){
            //check if user favorites includes post with id of 'postId'
            if(this.userFavorites && this.userFavorites.some(fave => fave._id === postId)){
                this.postLiked = true;
                return true;
            } else{
                this.postLiked = false;
                return false;
            }
        },
        goToPreviousPage(){
            this.$router.go(-1);
        },
        toggleImageDialog(){
            if(window.innerWidth > 500){
                this.dialog = !this.dialog;
            }
        },
        handleAddPostMessage(){
            if(this.$refs.form.validate()){

            //TODO handle userid and postid on backend
            const variables = {
                messageBody: this.messageBody,
                userId: this.user._id,
                postId: this.postId
            }
            this.$apollo.mutate({
                mutation: ADD_POST_MESSAGE,
                variables,
                update: (cache, {data: {addPostMessage}}) => {
                    const data = cache.readQuery({
                        query : GET_POST,
                        variables: {postId: this.postId}
                    });
                    data.getPost.messages.unshift(addPostMessage);
                    cache.writeQuery({
                        query: GET_POST,
                        variables: {postId: this.postId},
                        data
                    });
                    // console.log('data', data);
                    // console.log('add post message', addPostMessage);
                }
            }).then(({data}) => {
                this.$refs.form.reset();
                console.log(data.addPostMessage);
            }).catch(err => console.error(err))
            }
        },
        checkIfOwnMessage(message){
            return this.user && this.user._id === message.messageUser._id;
        },
        handleToggleLike(){
            if(this.postLiked){
                this.handleUnlikePost();
            }else{
                this.handleLikePost();
            }
        },
        handleLikePost(){
            const variables ={
                postId: this.postId,
                username: this.user.username
            };
            this.$apollo.mutate({
                mutation: LIKE_POST,
                variables,
                update: (cache, {data: {likePost}}) =>{
                    const data = cache.readQuery({
                        query: GET_POST,
                        variables: {postId: this.postId}
                    });
                    data.getPost.likes +=1;
                    cache.writeQuery({
                        query: GET_POST,
                        variables: {postId: this.postId},
                        data
                    });
                    
                }
            }).then(({data}) => {
                //console.log('likepost', data.likePost);
                //console.log('user', this.user)
                const updatedUser= {...this.user,  favorites: data.likePost.favorites};
                this.$store.commit('setUser', updatedUser);
            }).catch(err => console.err(err))
        },
        handleUnlikePost(){
            const variables ={
                postId: this.postId,
                username: this.user.username
            };
            this.$apollo.mutate({
                mutation: UNLIKE_POST,
                variables,
                update: (cache, {data: {unlikePost}}) =>{
                    const data = cache.readQuery({
                        query: GET_POST,
                        variables: {postId: this.postId}
                    });
                    data.getPost.likes -=1;
                    cache.writeQuery({
                        query: GET_POST,
                        variables: {postId: this.postId},
                        data
                    });
                    
                }
            }).then(({data}) => {
                //console.log('likepost', data.likePost);
                //console.log('user', this.user)
                const updatedUser= {...this.user,  favorites: data.unlikePost.favorites};
                this.$store.commit('setUser', updatedUser);
            }).catch(err => console.err(err))
        }
    }
}
</script>

<style scoped>
#post__image{
    height: 400px !important;
}

</style>
