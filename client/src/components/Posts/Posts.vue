<template>
    <v-container text-xs-center v-if="infiniteScrollPosts">

        <h1>Posts</h1>
        <div v-for="post in infiniteScrollPosts.posts" :key="post._id">
            <img :src="post.imageUrl" height="100px">
            <h3>{{post.title}}</h3>

        </div>
        <v-btn @click="showMorePosts" v-if="showMoreEnabled">Fetch More</v-btn>
    </v-container>
</template>

<script>
import { INFINITE_SCROLL_POSTS} from '../../queries';
const pageSize = 2;

export default {
    name: 'Posts',
    data() {
        return{
            pageNum: 1,
            showMoreEnabled: true
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
