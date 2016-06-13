const expect = require('chai').expect;
const utils = require('./_libs.js').utils;

// 1. 你测试的事什么
// 2. 它是做什么的
// 3. 它实际输出了什么（实际行为）
// 4. 它本该输出什么 （预计行为）
// 5. 测试结果如何复现 

describe('bin/utils/utils.js Methods', function(){

	describe('Copy(target,deep) function', function(){

		// target is an object. deep is an boolean

		const copy = utils.copy;

		const obj_arg = {name: 'copy', arr: [1,3]};
		const arr_arg = [1,{name: 'copy'}];
		const obj_arr = obj_arg.arr;
		const arr_obj = arr_arg[1];

		// should test RegExp 正则 { name: /\.js?$/ };

		describe('Test arguments should return an object', function(){

			const actual_noargument = copy;
			const expect_noargument = Error;

			const actual_objectargument = copy(obj_arg);
			const expect_objectargument = 'object';

			const actual_arrayargument = copy(arr_arg);
			const expect_arrayargument = 'array';

			const actual_deepisdefault = copy(obj_arg).arr;
			//const expect_deepisdefault = 'deep copy';

			const actual_deepisstring = copy(obj_arg,'false').arr;
		  //const expect_deepisstring = 'deep copy';

			const actual_deepisnumber = copy(obj_arg, 0).arr;
			//const expect_deepisnumber = 'deep copy';

			const actual_deepisboolean = copy(obj_arg,true).arr;
			//const expect_deepisboolean = 'deep copy';

			const actual_deepisbooleanfalse = copy(obj_arg,false).arr;
			//const expect_deepisbooleanfalse = 'deep copy';

			it('Copy() No arguments should return Error', function(){
				expect(actual_noargument).to.throw(expect_noargument);
			});

			it('Copy({}) target of argument is Object-Type should return an object', function(){
				expect(actual_objectargument).to.be.an(expect_objectargument);
			});

			it('Copy([]) target of argument is Array-Type should return an array', function(){
				expect(actual_arrayargument).to.be.an(expect_arrayargument);
			});

			it('Copy({},deep) deep defualt value should deep copy', function(){
				expect(actual_deepisdefault).to.not.equal(obj_arr);
			});

			it('Copy({},"false") deep is String-Type should deep copy', function(){
				expect(actual_deepisstring).to.not.equal(obj_arr);
			});

			it('Copy({},1) deep is Number-Type should deep copy', function(){
				expect(actual_deepisnumber).to.not.equal(obj_arr);
			});

			it('Copy({},true) deep is Boolean-Type should deep copy', function(){
				expect(actual_deepisboolean).to.not.equal(obj_arr);
			});

			it('Copy({},false) deep is Boolean-Type should shallow copy', function(){
				expect(actual_deepisbooleanfalse).to.deep.equal(obj_arr);
			});

		});

		describe('Test return value. deep or shallow copy', function(){

			const actual_deepcopyobject = copy(obj_arg).arr;
			//const expect_deepcopyobject = 'deep copy object';

			const actual_deepcopyarray = copy(arr_arg)[1];
			//const expect_deepcopyarray = 'deep copy' object;

			const actual_shallowcopyobject = copy(obj_arg,false).arr;
			//const expect_shallowcopyobject ='shallow copy' array;

			const actual_shallowcopyarray = copy(arr_arg,false)[1];
			//const expect_shallowcopyarray = 'shallow copy array';

			it('should return a deep copy object', function(){
				expect(actual_deepcopyobject).to.not.equal(obj_arr);
			});

			it('should return a deep copy array', function(){
				expect(actual_deepcopyarray).to.not.equal(arr_obj);
			});

			it('should return a shallow copy object', function(){
				expect(actual_shallowcopyobject).to.be.equal(obj_arr);
			});

			it('should return a shallow copy array', function(){
				expect(actual_shallowcopyarray).to.be.equal(arr_obj);
			});

		});

	});

	describe('Merge(source,target) function', function(){

		const merge = utils.merge;

		const err = Error;
		const source_obj = {id:'01', arr: [1,2]};
		const target_obj = {id: '02', name: 'merge', arr:[1,3,5]};

		const source_arr = [1,2,{name: '01'}];
		const target_arr = [1,3,5,{name:'02'}];

		describe('Test aguments and result', function(){

			const actual_obj = merge(source_obj,target_obj);
			const expect_obj = {id:'02',name:'merge',arr:[1,3,5]};

			const actual_arr = merge(source_arr,target_arr);
			const expect_arr = [1,2,{name: '01'}, 3,5, {name: '02'}];

			it('Merge() No arguments or error argument should return Error', function(){
				expect(merge).to.throw(err);
			});

			it('should source value is ' + expect_obj.toString(), function(){
				expect(source_obj).to.deep.equal(expect_obj);
			});

			it('should source value is ' + expect_arr.toString(), function(){
				expect(source_arr).to.deep.equal(expect_arr);
			});

		});

	});
});