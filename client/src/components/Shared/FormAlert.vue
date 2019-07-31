<template>
    <v-alert type="error" :value="true" transition="v-scroll-y" dismissible>
        {{message}}  
    </v-alert>
</template>

<script>
export default {
    props: ['message']
}
</script>

<style>

</style>
