<template>
    <v-container text-xs-center mt-5 pt-5>
        
        <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <h1 class="primary--text">Add Post</h1>
            </v-flex>
        </v-layout>

        <!-- Error Alert -->
        <!-- <v-layout v-if="error" row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <form-alert :message="error.message"></form-alert>
            </v-flex>
        </v-layout> -->
        <!-- Add Post Form -->
        <v-layout row wrap>
            
            <v-flex xs12 sm6 offset-sm3>
                        <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleAddPost">
                            <!-- titleinput -->
                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field :rules="titleRules" flex v-model="title" label="Post Title" type="text" required></v-text-field>
                                </v-flex>
                            </v-layout>
                            <!-- image url -->
                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field  :rules="imageRules" flex v-model="imageUrl" label="Image URL" type="text" required></v-text-field>
                                </v-flex>
                            </v-layout>

                             <!-- image preview -->
                            <v-layout v-if="imageUrl" row>
                                <v-flex xs12>
                                    <img :src="imageUrl" height="300px">
                                </v-flex>
                            </v-layout>

                             <!-- categories select-->
                            <v-layout row>
                                <v-flex xs12>
                                    <v-select :rules="categoriesRules"  v-model="categories" :items="['Art', 'Education', 'Travel', 'Photography', 'Technology']" multiple label="Categories"></v-select>
                                </v-flex>
                            </v-layout>

                             <!-- description-->
                            <v-layout row>
                                <v-flex xs12>
                                    <v-textarea :rules="descRules" v-model="description" label="Description" type="text" required></v-textarea>
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
                                    Submit
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapGetters} from 'vuex';
export default {
    name: 'Add Post',
    data(){
        return{
            isFormValid: true,
            title: '',
            imageUrl: '',
            categories: [],
            description: '',
            titleRules: [
                title => !!title || 'Title is required',
                title => title.length < 20 || 'Title must have less than 20 characters'
            ],
            imageRules: [
                imageUrl => !!imageUrl || 'Image is required'
            ],
            categoriesRules: [
                categories => categories.length >= 1 || 'At least one category is required'
            ],
            descRules: [
                description => !!description || 'Description is required',
                description => description.length < 20 || 'Description must have less than 20 characters'
            ],

        }
    },
    computed:{
        ...mapGetters(['loading', 'user'])
    },
    methods: {
        handleAddPost(){
            if(this.$refs.form.validate()){
                this.$store.dispatch('addPost', {
                    title: this.title,
                    imageUrl: this.imageUrl,
                    categories: this.categories,
                    description: this.description,
                    creatorId: this.user._id //todo: should be server side
                });
            }
        }
    }

}
</script>

<style>

</style>
