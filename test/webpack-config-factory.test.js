const expect = require('chai').expect;
const smartConfig = require('./_libs.js').smartConfig;

// 1. 你测试的事什么
// 2. 它是做什么的
// 3. 它实际输出了什么（实际行为）
// 4. 它本该输出什么 （预计行为）
// 5. 测试结果如何复现 

describe('bin/webpack/config.js WebpackConfigFactory', function(){

	describe('Through process.env.MODE or process.env.NODE_ENV should return diffrent configuration', function(){

		describe('process.env.MODE value is undefined', function(){
			const actual_ondebug = true;
			const expect_ondebug = true;

			it('should return function', function(){
				expect(require('../bin/webpack/config.js')).to.be.a('function');
			});

			it('turn on the debug-mode', function(){
				expect(require('../bin/webpack/config.js')(smartConfig).debug).to.be.true;
			}); 
		})


		describe('process.env.MODE value is development', function(){

			before(function(){
				process.env.MODE = 'development';
			});

			it('should return function', function(){
				expect(require('../bin/webpack/config.js')).to.be.a('function');
			});

			it('turn on the debug-mode', function(){
				expect(require('../bin/webpack/config.js')(smartConfig).debug).to.be.true;
			}); 
		});

		describe('process.env.MODE value is devel', function(){

			before(function(){
				process.env.MODE = 'production'; // devel , public
			});
			
			// it('should return object configuration', function(){
			// 	expect(require('../bin/webpack/config.js')).to.be.an('object');
			// });

			// it('turn off the debug-mode', function(){
			// 	expect(require('../bin/webpack/config.js').debug).to.be.false;
			// });

			// it('should process.env.NODE_ENV equal production', function(){
			// 	expect(process.env.NODE_ENV).to.be.equal('production');
			// });
		});

	});
});