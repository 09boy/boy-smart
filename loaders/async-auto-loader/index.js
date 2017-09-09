const { getOptions, stringifyRequest, interpolateName }  = require('loader-utils');

// module.exports = function() {}

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
	// const callback = this.async();
	const query = getOptions(this) || {pages: 'pages', mode: 'normal'};
	const regex = /\/pages\/*\/[a-z^\w+$]*\/index\.js(x)?/;
	// this.context a/b
	// this.resourcePath a/b/index.js

	if (process.env.NODE_ENV !== 'development' && regex.exec(this.resourcePath)) {
		this.cacheable && this.cacheable();
		const moduleRequest = '!!' + precedingRequest  + '!' + remainingRequest;

		let chunkNameParam = ', ' + JSON.stringify(this.context.split('/').pop()); //
		if(query.name) {
			const options = {
				context: query.context || this.options.context,
				regExp: query.regExp
			};
			const chunkName = interpolateName(this, query.name, options);
			chunkNameParam = ', ' + JSON.stringify(chunkName);		
		}

		/*const normalLazyLoader = [
			'const loadComponent = require.ensure([], function() {',
			`	return require(${stringifyRequest(this, moduleRequest)}).default;`,
			`}${chunkNameParam});`,
			'module.exports = () => {loadComponent.then(page => {new page();});}'
		];*/

		const lazyLoader = [
			'const loadComponent = () => require.ensure([], function() {',
			`	return require(${stringifyRequest(this, moduleRequest)});`,
			`}${chunkNameParam});`,
			`const AsyncBundle = require(${stringifyRequest(this, require.resolve('./AsyncBundle'))}).default;`,
			'module.exports = (props)=>(React.createElement(AsyncBundle,',
			`	{load: loadComponent, originProps: props}, null))`,
		];

		// const targetLoader = {normal: normalLazyLoader, react: lazyLoader};
		return lazyLoader.join('\n');
	}
};

