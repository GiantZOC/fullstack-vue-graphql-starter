<template>
    <v-container text-xs-center mt-5 pt-5>
        
        <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <h1>Sign In</h1>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            
            <v-flex xs12 sm6 offset-sm3>
                
                <v-card color="primary" dark>
                    <v-container>
                        <v-form @submit.prevent="handleSigninUser">
                            <v-layout row>
                                <v-flex xs12>
                                <!-- <v-text-field flex  v-model="username" prepend-icon="mdi-magnify" placeholder="Search posts" color="accent" single-line-hide-details required></v-text-field> -->
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field flex v-model="username" prepend-icon="mdi-face" label="Username" type="text" required></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field v-model="password" prepend-icon="mdi-puzzle" label="Password" type="password" required></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-btn color="accent" type="submit">Signin</v-btn>
                                    <h3>Don't have an account?
                                        <router-link to="/signup">Signup</router-link>
                                    </h3>
                                </v-flex>
                            </v-layout>
                        </v-form>
                    </v-container>

                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapGetters} from 'vuex';
export default {
    name: 'SignIn',
    data(){
        return{
            username: '',
            password: ''
        }

    },
    computed: {
        ...mapGetters(['user'])
    },
    watch: {
        user(value){
            // if user changes from null to object, redirect to home page
            if(value){
                this.$router.push('/');
            }
        }
    },
    methods: {
        handleSigninUser(){
            this.$store.dispatch('signinUser', {
                username: this.username,
                password: this.password
            })
        }
    }
}
</script>

<style>

</style>
