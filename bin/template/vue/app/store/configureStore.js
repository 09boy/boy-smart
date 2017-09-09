import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import * as publicModules from '../modules/pub.modules.js';
import * as privateModules from '../modules/private.modules.js';
import rootActions from '../actions';
import rootMutations from '../mutations';

Vue.use(Vuex);

export default (routes) => {
	return new Vuex.Store({
		plugins: [createLogger()],
  	modules: {
  		...publicModules, 
  		...privateModules
  	},
  	state: {
  		routes
  	},
  	actions: {
  		...rootActions
  	},
  	mutations: {
  		...rootMutations
  	},
  	getters: {
  		rootNavData: state => state.routes,
  	},
  	strict: process.env.NODE_ENV !== 'production'
	});
};
