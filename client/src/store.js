import Vue from 'vue'
import Vuex from 'vuex'
import {defaultClient as apolloClient} from './main.js';
import router from './router.js';
import  {GET_POSTS, SIGNIN_USER, GET_CURRENT_USER, SIGNUP_USER, ADD_POST, SEARCH_POSTS, GET_USER_POSTS, UPDATE_USER_POST, DELETE_USER_POST, INFINITE_SCROLL_POSTS} from "./queries.js"; 

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    userPosts: [],
    loading: false,
    error: null,
    authError: null,
    searchResults: []
  },
  mutations: {
    setPosts: (state, payload) =>{
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setUser: (state,payload) => {
      state.user = payload;
    },
    setUserPosts: (state,payload) => {
      state.userPosts = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    clearError: (state) =>{
      state.error = null;
    },
    setAuthError: (state, payload) =>{
      state.authError = payload;
    },
    setSearchResults: (state, payload) => {
      if(payload != null){
        state.searchResults = payload;
      }
    },
    clearSearchResults: (state) =>{
      state.searchResults = null;
    }
  },
  actions: {
    getCurrentUser: ({commit}) =>{
      commit('setLoading', true);
      apolloClient.query({
        query: GET_CURRENT_USER
      })
      .then(({data}) => {
        commit('setLoading', false);
        commit('setUser', data.getCurrentUser);
        //console.log(data.getCurrentUser);
      })
      .catch(err => {
        commit('setLoading', false);
        console.error(err);
      })
    },
    addPost: ({commit}, payload) => {
      apolloClient
      .mutate({
        mutation: ADD_POST,
        variables: payload,
        update: (cache, {data: {addPost}}) =>{
          // First read the query
          const data = cache.readQuery({query: GET_POSTS});
          // create updated data
          data.getPosts.unshift(addPost);
          //write updated data object back to query
          cache.writeQuery({
            query: GET_POSTS,
            data
          });
          //console.log(cache, data);
        },
        //optimistic response ensured data is added immediately
        optimisticResponse:{
          __typename: 'Mutation',
          addPost: {
            __typename: 'Post',
            _id: -1,
            ...payload
          }
        },
        //rerun specific queries after performing mutation to get fresh data
        refetchQueries:[
          {
            query: INFINITE_SCROLL_POSTS,
            variables:{
              pageNum: 1,
              pageSize: 2
            }
          }
        ]

      })
      .then(({data}) => {
        // commit('setLoading', false);
        // commit('setUser', data.getCurrentUser);
        //console.log(data.addPost);
      })
      .catch(err => {
        // commit('setLoading', false);
        console.error(err);
      })
    },
    updateUserPost: ({commit, state}, payload) => {
      apolloClient.mutate({
        mutation: UPDATE_USER_POST,
        variables: payload
      })
      .then(({data}) =>{
        const index = state.userPosts.findIndex(post => post._id === data.updateUserPost._id);
        const userPosts = [
          ...state.userPosts.slice(0, index),
          data.updateUserPost,
          ...state.userPosts.slice(index + 1)
        ];
        commit("setUserPosts", userPosts);
        //console.log("userPosts", state.userPosts);
        //console.log("update User Post", data.updateUserPost);
      })
      .catch(err => {
        console.error(err);
      })
    },
    deleteUserPost: ({state, commit}, payload) =>{
      apolloClient.mutate({
        mutation: DELETE_USER_POST,
        variables: payload
      })
      .then(({data}) =>{
        const index = state.userPosts.findIndex(post => post._id === data.deleteUserPost._id);
        const userPosts = [
          ...state.userPosts.slice(0, index),
          ...state.userPosts.slice(index + 1)
        ];
        commit("setUserPosts", userPosts);
      })
      .catch(err => {
        console.error(err);
      })
    },
    getPosts: ({commit}) =>{
      // use apolloclient to fire getPosts query
      commit('setLoading', true);
      apolloClient
        .query({
          query: GET_POSTS
        }).then(({data}) =>{
          // Get data from actions to state via mutations
          // commit passes data from actions to mutation function
          commit('setPosts', data.getPosts);
          commit('setLoading', false);
          //console.log(data.getPosts);

        }).catch(err => {
          commit('setLoading', false);
          console.error(err);
        }) 
    },
    getUserPosts: ({commit}, payload) => {
      apolloClient.query({
        query: GET_USER_POSTS,
        variables: payload
      }).then(({data}) => {
        commit('setUserPosts', data.getUserPosts);
      }).catch(err => {
        console.error(err);
      })
    },
    searchPosts: ({commit}, payload) => {
      apolloClient.query({
        query: SEARCH_POSTS,
        variables: payload
      }).then(({data}) => {
        //console.log(data);
        commit('setSearchResults', data.searchPosts);
      }).catch(err => {console.error(err)});
    },
    signinUser: ({commit}, payload) => {
      commit('clearError');
      commit('setLoading', true);
      //clear token to prevent errors
      localStorage.setItem('token', "");
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({data}) => {
          commit('setLoading', false);
          localStorage.setItem("token", data.signinUser.token);
          //console.log(data.signinUser);
          // refresh the page to get teh current user
          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
          console.error(err);
        })
    },
    signupUser: ({commit}, payload) => {
      commit('clearError');
      commit('setLoading', true);
      //clear token to prevent errors
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({data}) => {
          commit('setLoading', false);
          localStorage.setItem("token", data.signupUser.token);
          //console.log(data.signinUser);
          // refresh the page to get teh current user
          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
          console.error(err);
        })
    },
    signoutUser: async ({commit}) => {
      //clear user in state
      commit('clearUser');

      //remove token in localStorage
      localStorage.setItem('token', '');

      //end session
      await apolloClient.resetStore();

      //redirect home
      router.push("/");
      //console.dir(apolloClient);

    }
  },
  getters:{
    posts: state => state.posts,
    userPosts: state => state.userPosts,
    loading: state => state.loading,
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    error: state => state.error,
    authError: state => state.authError,
    searchResults: state => state.searchResults
  }
})
