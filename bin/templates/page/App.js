// example

import React, { Component } from 'react';

class TitleComponent extends Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return(
			<h1>{this.props.title}</h1>
		);
	}
}

export class App extends Component {
	render() {
		return(
			<div className='title-content'>
				<TitleComponent title={ 'Hello World!' } />
			</div>
		);
	}
};