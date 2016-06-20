const Mock = require('mockjs');
const Random = Mock.Random;

// http://mockjs.com/examples.html
// http://mockjs.com/0.1/

const s = Mock.mock({
	'author': '@name'
});

console.log(s);

const list_s = Mock.mock({
	'list|1-10': [{
		'author': '@name',
		'id|+1': Date.now(),
		'text': '@title'
	}]
});

// console.log(list_s);

// Random.now();
// console.log(Mock.mock('@now'));
