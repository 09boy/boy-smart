import * as ActionTypes from '../constants';

const commonState = {
	// hotCities: []
};

export default (state=commonState, action) => {
	switch (action.type) {
		/*case ActionTypes.FETCH_HOT_CITIES:
			return {...state, hotCities: [...action.data]};*/
		default:
			return state;
	}
};