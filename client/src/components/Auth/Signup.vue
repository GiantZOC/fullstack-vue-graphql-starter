<template>
    <v-container text-xs-center mt-5 pt-5>
        
        <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <h1>Sign Up</h1>
            </v-flex>
        </v-layout>

        <!-- Error Alert -->
        <v-layout v-if="error" row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <form-alert :message="error.message"></form-alert>
            </v-flex>
        </v-layout>
        <!-- Error Form -->
        <v-layout row wrap>
            
            <v-flex xs12 sm6 offset-sm3>
                
                <v-card color="primary" dark>
                    <v-container>
                        <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleSignupUser">
                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field :rules="usernameRules" flex v-model="username" prepend-icon="mdi-face" label="Username" type="text" required></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field :rules="emailRules" flex v-model="email" prepend-icon="mdi-email" label="Email" type="text" required></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field :rules="passwordRules" v-model="password" prepend-icon="mdi-puzzle" label="Password" type="password" required></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field :rules="passwordRules" v-model="passwordConfirmation" prepend-icon="mdi-gavel" label="Password Confirmation" type="password" required></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-btn
                                    :loading="loading"
                                    :disabled="loading || !isFormValid"
                                    color="accent"
                                    type="submit"
                                    
                                    >
                                    Signup
                                    </v-btn>
                                    <h3>Already have an account?
                                        <router-link to="/signin">Signin</router-link>
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
import {mapGetters} from 'vuex';

export default {
    name: 'Signup',
    data(){
        return{
            isFormValid: true,
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            usernameRules: [
                username => !!username || 'Username is required',
                username => username.length <= 10 || "Username cannot be more than 10 characters"
            ],
            emailRules: [
                email => !!email || 'Email is required',
                email => /.@+./.test(email) || 'Email must be valid'

            ],
            passwordRules: [
                password => !!password || 'Password is required',
                password => password.length >= 4 || "Password must be at least 4 characters",
                passwordConfirmation => passwordConfirmation === this.password || "Passwords must match"
            ],
        }
    },
    computed: {
        ...mapGetters(['error', 'loading', 'error'])
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
        handleSignupUser(){
            if(this.$refs.form.validate()){
                this.$store.dispatch('signupUser', {
                    username: this.username,
                    email: this.email,
                    password: this.password
                });
            }

        }
    }
}
</script>

<style>

</style>
