import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// You can write 'common' code in separate file
/*const common = (state = {}, action) => {
	catch (action.type) {
		default:
			return state;
	}
};*/

const rootReducer = combineReducers({
	// common,
  routing: routerReducer,
});

export default rootReducer;
