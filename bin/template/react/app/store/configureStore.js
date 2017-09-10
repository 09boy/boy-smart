import { createStore, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from '../reducers';

const middlewares = [thunkMiddleware];
const envMode = process.env.NODE_ENV;

if (envMode !== 'release') {
	// other middlewares
  const logger = createLogger({
    level: 'info',
    logger: console,
    collapsed: true
  });
  middlewares.push(logger);
}

const configureStore = (browserHistory, initialState) => {
	middlewares.push(routerMiddleware(browserHistory));
	const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
	return createStoreWithMiddleware(reducer, initialState);
};

export default configureStore;