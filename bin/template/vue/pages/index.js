import App from './app.js';

const render = () => {
	App.$mount('#app');
}

render(App);

if (module.hot) module.hot.accept('./app.js', () => render());