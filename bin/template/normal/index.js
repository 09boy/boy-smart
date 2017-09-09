import App from './app.js';

const appContainer = document.querySelector('#app');
let element = App(); // Store the element to re-render on app.js changes

appContainer.appendChild(element);

if (module.hot) {
	module.hot.accept('./app.js', () => {
		appContainer.removeChild(element);
    element = App(); // Re-render the 'component' to update the component content
   	appContainer.appendChild(element);
	});
};
