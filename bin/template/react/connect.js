import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../app/actions';

const mapStateToProps = (props, state) => {
  if (!props) return state;

  if (typeof props === 'function') return props;

  if (typeof props === 'string') return { [props]: state[props] };

  if (Array.isArray(props)) {
    return props.reduce((prev, curr) => prev[curr] = state[curr], {});
  }

  return state
}

// const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});
const mapDispatchToProps = localActions => dispatch => ({actions: bindActionCreators({...localActions, ...actions}, dispatch)});

export default (props, localActions) => {
  return target => connect(mapStateToProps.bind(null, props), mapDispatchToProps(localActions))(target)
}
