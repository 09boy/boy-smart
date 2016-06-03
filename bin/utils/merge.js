/**
	* copy
	* @param target object 
	* @param deep boolean  default is true
	* return new object
	*/
const copyObject = function(target,deep){

	deep = deep || true;
	if(typeof target !== 'object') {
		console.log('Error:: argument error <target is object>');
		return;
	}

	var o = target instanceof Array ? [] : {};
	var value;
	for(var k in target){
		value = target[k];
		o[k] = deep ? typeof value !== 'object' ? value : copyObject(value,deep) : value;
	}
	return o;
};

/**
	* merge object
	* @param source object
	* @param target object
	* return source
	*/
const merge = function(source,target){

	if(typeof source !== 'object') {
		console.log('Error:: argument error <target is object>');
	}

	const isSourceArr = source instanceof Array;

	if(typeof target !== 'object' || (target instanceof Array) != isSourceArr) {
		console.log('Error:: argument error <source and target are must be same type(Object)>');
		return;
	}

	var value,data;
	for(var k in target){
		value = target[k];
		data = value !== 'object' ? value : copyObject(value);
		if(isSourceArr){
			if(source[k]){
				source[k] = data;
			}else{
				source.push(data);
			}
		}else{
			source[k] = data;
		}
	}
};

module.exports = merge;