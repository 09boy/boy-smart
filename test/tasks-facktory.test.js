const expect = require('chai').expect;
const tasksFactory = require('./_libs.js').tasksFactory;
const smartConfigFactory = require('./_libs.js').smartConfigFactory;

describe('tasksFactory', function(){

	it('should return an object', function(){
		expect(tasksFactory(smartConfigFactory)).to.be.an('object');
	});

});