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
<style lang='scss'>
  html,
  body,
  #app,
  .app-container,
  .page-container {
    width: 100%;
    height: 100%;
    font-family: Helvetica;
  }

  body, ul, {
    margin: 0;
    padding: 0;
  }

  h2 {
    font-weight: normal;
  }
  
  .page-container {
    position: relative;
    h2 {
      position: absolute;
      color: #f44336;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 30px;
      text-align: center;
    }
  }
</style>