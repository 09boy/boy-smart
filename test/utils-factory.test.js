const expect = require('chai').expect;
const utilsFactory = require('./_libs.js').utilsFactory;

/*
	1. 你测试的是什么 What component aspect are you testing?
	2. 它是做什么的? What is to do?
	3. 它实际输出了什么？What is the actual output?
	4. 它本该输出什么?  What is the expected output?
	5. 测试结果如何复现? What should the feature do?

*/


describe('utilsFactory', function(){

	describe('FilterArray function output value', function(){

		const filterArray = utilsFactory.filterArray;

		// filterArray(source,target); all Array type
		
	});

	describe('CopyObject function output type and value', function(){

		const copyObject = utilsFactory.copyObject;
		const target = { name: 'Beijing', cities: ['ChaoYang','HaiDian','WangJing'] };
		const targetArray = [ 1, 'string', { object: 'type-object' }, [ 'type-array' ] ];

		// copyObject(target,deep);

		const actual_miss_arg = copyObject();        // expected undefined

		const actual_err_arg = copyObject(true);         // expected undefined;

		const actual_new_obj = copyObject(target);   // expected new_obj !== target

		const actual = typeof copyObject({});   
		const expected = 'object';

		const actual_new_empty_arr = copyObject([]);
		const expected_new_empty_arr = 0;

		const actual_deep_copy = copyObject(target,'false');           // expected returnObject.cities !== target.cities;

		const actual_obj_shallow_copy = copyObject(target,false);      // expected returnObject.cities === target.cities;

		const actual_obj_deep_copy = copyObject(target);          		 // expected returnObject.cities !== target.cities;

		const actual_arr_shallow_copy = copyObject(targetArray,false); // expected returnArr[2] === targetArray[2];

		const actual_arr_deep_copy = copyObject(targetArray);          // expected returnArr[2] !== targetArray[2];

		it('missing argument <target> should return undefined', function(){
			expect(actual_miss_arg).to.be.undefined;
		});

		it('error argument <target> should return undefined', function(){
			expect(actual_miss_arg).to.be.undefined;
		});

		it('copyObject(target) shuold return a new object that is not equal target', function(){
			expect(actual_err_arg).to.not.equal(target);
		});

		it('copyObject({}) should return a new empty object', function(){
			expect(actual).to.deep.equal(expected);
		});

		it('copyObject([]) should return a new empty array', function(){
			expect(actual_new_empty_arr).to.be.length(expected_new_empty_arr);
		});

		it('copyObject(target,"false") should return a deep copy object', function(){
			expect(actual_deep_copy.cities).to.not.equal(target.cities);
		});

		it('copyObject(target,false) should return a shallow copy object', function(){
			expect(actual_obj_shallow_copy.cities).to.deep.equal(target.cities);
		});

		it('copyObject(target) should return a deep copy object', function(){
			expect(actual_obj_deep_copy.cities).to.not.equal(target.cities);
		});

		it('copyObject(targetArray,false) should return a shallow copy array', function(){
			expect(actual_arr_shallow_copy[2]).to.deep.equal(targetArray[2]);
		});

		it('copyObject(targetArray) should return a deep copy array', function(){
			expect(actual_arr_deep_copy[2]).to.not.equal(targetArray[2]);
		});
		
	});

	describe('Merge function ', function(){

		const merge = utilsFactory.merge;

		// merge(source,target);

		const sourceObj = { name: 'Beijing', cities: ['ChaoYang','HaiDian','WangJing'] };
		const targetObj = { name: 'Tianjing', codes: [ 1001, 1002] };
		const sourceArr = [ 1, 'string' , false, {object:'type-object'}, ['type-array'] ];
		const targetArr = [ true ];
		const emptyObj = {};
		const emptyArr = [];

		const actual_miss_arg = merge();          								// expected undefined || no nothing

		const actual_err_arg_source = merge('string');    				// expected undefined || no nothing

		const actual_err_arg_target = merge(sourceObj,'strng');   // expected undefined || no nothing

		const actual_not_same_type = merge(emptyObj,emptyArr);    // expected undefined || no nothing

		const actual_empty_source = merge(emptyObj,targetObj);    // expected source contains each elements of target

		const actual_empty_target = merge(sourceObj,emptyObj);    // extected not change source value

		const actual_empty_arg = merge(emptyObj,{});              // extected empty source

		const actual_merge_obj = merge(sourceObj,targetObj);      // extected source contains target, but exclude same Key,but value of same Key is override source value 

		const actual_merge_arr = merge (sourceArr,targetArr);     // extected same above up

		it('missing arguments <source,target>: should do nothing', function(){
			expect(actual_miss_arg).to.be.undefined;
		});

		it('error <source> argument: should do nothing', function(){
			expect(actual_err_arg_source).to.be.undefined;
		});

		it('error <target> argument: should do nothing', function(){
			expect(actual_err_arg_target).to.be.undefined;
		});

		it('not same type: should do nothing', function(){
			expect(actual_not_same_type).to.be.undefined;
		});

		// it('empty source: should source contains each elements of target', function(){
		// 	expect(actual_empty_source).to.contain.all.keys(targetObj);
		// });
	});

	// describe('getHTMLTemplate()', function(){

	// 	const htmlTemplate = utilsFactory.getHTMLTemplate;

	// 	describe('missing option', function(){
			
	// 		it('missing option', function(){
	// 			expect(htmlTemplate()).to.be.an('object');
	// 		});

	// 		it('set error option', function(){
	// 			expect(htmlTemplate('string').template).to.be.undefined;
	// 		});
	// 		// it('set option.template', function(){
	// 		// 	expect(htmlTemplate( {template:'index.template.html'} ).template).to.be.equal('index.template.html');
	// 		// });
	// 	});

	// });
});