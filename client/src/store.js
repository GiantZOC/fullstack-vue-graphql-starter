import Vue from 'vue'
import Vuex from 'vuex'
import {defaultClient as apolloClient} from './main.js';
import { gql } from "apollo-boost";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {
    getPosts: () =>{
      // use apolloclient to fire getPosts query
      apolloClient
        .query({
          query: gql`
            query{
              getPosts{
                _id
                title
                imageUrl
              }
            }
          `
        }).then(data =>{
          console.log(data);

        }).catch(err => {
          console.error(err);
        })
    }
  }
})
