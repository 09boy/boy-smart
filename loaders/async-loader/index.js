const loaderUtils = require('loader-utils');

// module.exports = function(content) {}

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
	if (process.env.NODE_ENV !== 'development') {
		this.cacheable && this.cacheable();
		const moduleRequest = '!!' + remainingRequest;
		const query = loaderUtils.getOptions(this) || {};
		let chunkNameParam = '';
		if(query.name) {
			const options = {
				context: query.context || this.options.context,
				regExp: query.regExp
			};
			const chunkName = loaderUtils.interpolateName(this, query.name, options);
			chunkNameParam = ', ' + JSON.stringify(chunkName);		
		}

		const lazyLoader = [
			'const loadComponent = () => require.ensure([], function() {',
			`	return require(${loaderUtils.stringifyRequest(this, moduleRequest)});`,
			`}${chunkNameParam});`,
			`const AsyncBundle = require(${loaderUtils.stringifyRequest(this, require.resolve('./AsyncBundle'))}).default;`,
			'module.exports = (props)=>(React.createElement(AsyncBundle,',
			`	{load: loadComponent, originProps: props}, null))`,
		];
		return lazyLoader.join('\n');
	}
};
