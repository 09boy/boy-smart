const expect = require('chai').expect;
const smartConfigFactory = require('./_libs.js').smartConfigFactory;

describe('smartConfigFactory', function(){
	
	it('PORT\'s value length is four ', function(){
		expect(smartConfigFactory.PORT).to.have.lengthOf(4);
	});
	
	it('POST default value is 127.0.0.1', function(){
		expect(smartConfigFactory.HOST).to.be.equal('127.0.0.1');
	});
	
});