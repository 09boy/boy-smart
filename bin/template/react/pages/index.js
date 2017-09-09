import ReactDom from 'react-dom';
import App from './app.js';

const renderToEl = document.querySelector('#app');
const render = (Component) => (
	ReactDom.render(<Component />, renderToEl)
);

render(App);

if (module.hot) module.hot.accept('./app.js', () => render(App));
