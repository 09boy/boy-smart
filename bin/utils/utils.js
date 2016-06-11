
/**
 * copy an object
 * @param {Object} target
 * @param {Boolean} deep    true is deep copy; default is true unless you set value of boolean false. ('false' not false)
 * return object
 */
const copy = function(target,deep){

	if(!arguments.length || typeof target !== 'object') {
		throw new Error('copy(target,deep)->Argument Error: target is an object type.');
	}

	deep = deep !== false ? true : false; 

	var o = target instanceof Array ? [] : {},
			value;

	for(var k in target){
		value = target[k];
		o[k] = deep ? typeof value !== 'object' || value.test !== undefined ? value : copy(value,deep) : value;
	}

	return o;
};

exports.copy = copy;


/**
 * merge object; filter same key and value if array arguments
 * @param {Object}
 * @param {Object}
 * return undefined
 */
const merge = function(source,target){

	if(arguments.length < 2) {
		throw new Error('merge(source,target)->Argument Error: Both source and target are must be have.');
	}

	if(typeof source !== 'object') {
		throw new Error('merge(source,target)->Argument Error: source is an object type.');
	}

	if(typeof target !== 'object') {
		throw new Error('merge(source,target)->Argument Error: target is an object type.');
	}

	const sourceType = source instanceof Array;
	const targetType = target instanceof Array;

	if(sourceType !== targetType) {
		throw new Error('merge(source,target)->Argument Error: Both source and target muste be same object type.');
	}

	var tValue;
	for(var k in target){
		tValue = target[k];
		tValue = typeof tValue !== 'object' ? tValue : copy(tValue);

		if(!sourceType){
			source[k] = tValue;
		}else if(source.indexOf(tValue) < 0){
			source.push(tValue);
		}
	}
};

exports.merge = merge;


// resolve module path
exports.resolvePath = function (target){

	var queryStr = '',
			queryStart = target.indexOf('/');
	if(queryStart > -1){
		queryStr = target.substr(queryStart);
		target = target.substr(0,queryStart);
	}

	return require.resolve(target) + queryStr;
};
