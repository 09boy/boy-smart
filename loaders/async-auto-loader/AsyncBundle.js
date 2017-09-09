// Boilerplate `import` and `export` statements are omitted for brevity
export default class AsyncBundle extends React.Component {
  // static propTypes = {
  //   load: PropTypes.func
  // };

  constructor(props) {
    super(props);
    this.state = { page: null };
  }

  componentWillMount() {
    this.loadModule(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.loadModule(nextProps);
    }
  }

  loadModule(props) {
    this.setState({ page: null });
    props.load().then(mod => {
      this.setState({ page: mod.default || mod });
    });
  }

  render() {
    return this.state.page ? React.createElement(this.state.page, this.props.originProps): null;
  }
}
