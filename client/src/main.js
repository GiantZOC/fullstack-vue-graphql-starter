import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "@babel/polyfill";

import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

import FormAlert from "./components/Shared/FormAlert";

Vue.component("form-alert", FormAlert);

Vue.use(VueApollo);
console.log("env", process.env);
console.log("Graphql", process.env.VUE_APP_GRAPHQL_URI);

// Setup ApolloClient
export const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
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
