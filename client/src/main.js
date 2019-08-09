import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "@babel/polyfill";

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

import FormAlert from "./components/Shared/FormAlert";
// import environment variable and models
//require('dotenv').config();
//register global component

Vue.component("form-alert", FormAlert);

Vue.use(VueApollo);
console.log("GRAPHQL", process.env);

// Setup ApolloClient
export const defaultClient = new ApolloClient({
  uri: process.env.graphql,
  //include auth token with requests made to backend
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    //if no token in localStorage add it
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }
    //operation add the token to an autorization header, which is sent to backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log("[networkError]", networkError);
    }
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        if (err.name === "AuthenticationError") {
          //set auth error in state
          store.commit("setAuthError", err);
          store.dispatch("signoutUser");
        }
        console.dir(err);
      }
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
  provide: apolloProvider.provide(),
  router,
  store,
  vuetify,
  render: h => h(App),
  created() {
    // execute getCurrentUser query
    this.$store.dispatch("getCurrentUser");
  }
}).$mount("#app");
