import Vue from 'vue'
import Vuex from 'vuex'
import {defaultClient as apolloClient} from './main.js';
import router from './router.js';
import  {GET_POSTS, SIGNIN_USER, GET_CURRENT_USER, SIGNUP_USER, ADD_POST, SEARCH_POSTS} from "./queries.js"; 

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
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
        console.log(data.getCurrentUser);
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
          console.log(cache, data);
        },
        //optimistic response ensured data is added immediately
        optimisticResponse:{
          __typename: 'Mutation',
          addPost: {
            __typename: 'Post',
            _id: -1,
            ...payload
          }
        }
      })
      .then(({data}) => {
        // commit('setLoading', false);
        // commit('setUser', data.getCurrentUser);
        console.log(data.addPost);
      })
      .catch(err => {
        // commit('setLoading', false);
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
          console.log(data.getPosts);

        }).catch(err => {
          commit('setLoading', false);
          console.error(err);
        }) 
    },
    searchPosts: ({commit}, payload) => {
      apolloClient.query({
        query: SEARCH_POSTS,
        variables: payload
      }).then(({data}) => {
        console.log(data);
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
    loading: state => state.loading,
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    error: state => state.error,
    authError: state => state.authError,
    searchResults: state => state.searchResults
  }
})
