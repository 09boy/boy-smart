const expect = require('chai').expect;
const webpackConfigFactory = require('./_libs.js').webpackConfigFactory;

describe('webpackConfigFactory', function(){

	describe('if process.node.MODE is undefined or development', function(){
		
		before(function(){
			process.env.MODE = null;
		});
		it('should return config function', function(){
			expect(require('../bin/webpack/config.js')).to.be.a('function');
		});
	});

});

