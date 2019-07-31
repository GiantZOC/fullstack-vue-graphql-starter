import Vue from 'vue'
import Vuex from 'vuex'
import {defaultClient as apolloClient} from './main.js';
import router from './router.js';
import  {GET_POSTS, SIGNIN_USER, GET_CURRENT_USER} from "./queries.js"; 

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false
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
    signinUser: ({commit}, payload) => {
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({data}) => {
          localStorage.setItem("token", data.signinUser.token);
          console.log(data.signinUser);
          // refresh the page to get teh current user
          router.go();
        })
        .catch(err => {
          console.error(err);
        })
    }
  },
  getters:{
    posts: state => state.posts,
    loading: state => state.loading,
    user: state => state.user
  }
})
