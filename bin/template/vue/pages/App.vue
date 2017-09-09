<template>
  <div id='app'>
    <!-- <RootNav/></RootNav> -->
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <router-view></router-view>
  </div>
</template>
<script>
  // import { RootNav } from 'components';
  
  export default {
    name: 'App-View',

    components: {
      // RootNav
    },

    computed: {
      rootNavData() {
        // return this.$store.getters.rootNavData
      }
    }
  }
</script>
<style>
  html,
  body,
  div,
  ul,
  li {
    margin: 0;
    padding: 0;
  }

  body {
   font-family: Helvetica, sans-serif;
  }

  a {
    text-decoration: none;
  }

  li {
    list-style: none;
  }

  .page {
    position: absolute;
    left: 0;
    right: 0;
    top: 60px;
    bottom: 0;
  }
</style>