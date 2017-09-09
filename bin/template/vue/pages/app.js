import Vue from 'vue';
import VueRouter from 'vue-router';

import configureStore from 'app/store/configureStore';
import routes from './router.config';
import AppView from './App.vue';

Vue.config.productionTip = false;
Vue.use(VueRouter);

const store = configureStore(routes);
const router = new VueRouter({
	mode: 'history',
  routes
});

const App = new Vue({
	store,
	router,
	render: h => h(AppView)
});

export default App;