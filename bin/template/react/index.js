import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { render } from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import configureStore from 'app/store/configureStore'; 
import RouterConfig from './router.config';

// Create an enhanced history that syncs navigation events with the store
const history = createHistory();
const store = configureStore(history);

// for test
const navs = [], routers = [];
let count = 0;
for (let page in RouterConfig) {
	const { path, component } = RouterConfig[page];
	navs.push(<li key={`${path}_${count}`}><Link to={`${path}`}>{page.toLocaleUpperCase()}</Link></li>);
	if (page === 'home') {
		routers.push(<Route key={`${page}`} exact path={path} component={component}/>);
	} else {
		routers.push(<Route key={`${page}`} path={path} component={component}/>);
	}
	count++;
}

render(<Provider store={store}>
	{ /* ConnectedRouter will use the store from Provider automatically */ }
	<ConnectedRouter history={history}>
		<div>
			<ul>{navs}</ul>
			{routers}
		</div>
	</ConnectedRouter>
</Provider>, document.querySelector('#app'));
