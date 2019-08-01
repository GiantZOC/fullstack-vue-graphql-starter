<template>
    <v-container fluid grid-list-md>
        <!-- Post Cards -->
        <v-layout row wrap v-if="infiniteScrollPosts">
            <v-flex xs12 sm6 v-for="post in infiniteScrollPosts.posts" :key="post._id">
                <v-card hover>
                    <v-img :src="post.imageUrl" height="30vh" lazy>

                    </v-img>
                    <v-card-actions>
                        <v-card-title primary>
                            <div>
                                <div class="headline">{{post.title}}</div>
                                <span class="grey--text">{{post.likes}} likes - {{post.messages.length}} comments</span>
                            </div>

                        </v-card-title>
                        <v-spacer></v-spacer>
                        <v-btn @click="showPostCreator= !showPostCreator">
                            <v-icon>{{`${showPostCreator ? "mdi-chevron-up": "mdi-chevron-down"}`}}</v-icon>
                        </v-btn>
                    </v-card-actions>
                    <!-- Post Creator Tile -->
                    <v-slide-y-transition>
                        <v-card-text v-show="showPostCreator" class="grey lighten-4">
                            <v-list>
                                <v-list-item>
                                    <!-- <v-list-item-icon>
                                    <v-icon v-if="item.icon" color="pink">star</v-icon>
                                    </v-list-item-icon> -->

                                    

                                    <v-list-item-avatar>
                                    <v-img :src="post.createdBy.avatar" alt=""></v-img>
                                    </v-list-item-avatar>

                                    <v-list-item-content>
                                    <v-list-item-title>{{post.createdBy.username}}</v-list-item-title>
                                    <v-list-item-subtitle class="font-weight-thin">Added {{post.createdDate}}</v-list-item-subtitle>
                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <v-btn icon ripple>
                                            <v-icon color="grey lighten-1">mdi-info</v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                        </v-card-text>
                    </v-slide-y-transition>
                </v-card>
            </v-flex>
        </v-layout>

        <v-layout v-if="showMoreEnabled" column>
            <v-flex xs12>
                <v-layout justify-center row>
                    <v-btn color="info" @click="showMorePosts">
                        Fetch More
                    </v-btn>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
    <!-- <v-container text-xs-center v-if="infiniteScrollPosts">

        <h1>Posts</h1>
        <div v-for="post in infiniteScrollPosts.posts" :key="post._id">
            <img :src="post.imageUrl" height="100px">
            <h3>{{post.title}}</h3>

        </div>
        <v-btn @click="showMorePosts" v-if="showMoreEnabled">Fetch More</v-btn>
    </v-container> -->
</template>

<script>
import { INFINITE_SCROLL_POSTS} from '../../queries';
const pageSize = 2;

export default {
    name: 'Posts',
    data() {
        return{
            pageNum: 1,
            showMoreEnabled: true,
            showPostCreator: false
        }
    },
    apollo: {
        infiniteScrollPosts: {
            query: INFINITE_SCROLL_POSTS,
            variables: {
                pageNum: 1,
                pageSize
            }
        }
    },
    methods:{
        showMorePosts(){
            this.pageNum +=1;
            //fetches more data and transform original result
            this.$apollo.queries.infiniteScrollPosts.fetchMore({
                variables: {
                    pageNum: this.pageNum,
                    pageSize
                },
                updateQuery: (prevResult, {fetchMoreResult}) =>{
                    console.log('previous result', prevResult.infiniteScrollPosts.posts);
                    console.log('fetch more result', fetchMoreResult);

                    const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
                    const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
                    this.showMoreEnabled = hasMore;

                    return{
                        infiniteScrollPosts:{
                            __typename: prevResult.infiniteScrollPosts.__typename,
                            // mrege previous posts with new posts
                            posts: [
                                ...prevResult.infiniteScrollPosts.posts,
                                ...newPosts
                            ],
                            hasMore
                        }
                    }
                }
            })

        }
    }
}
</script>

<style>

</style>
