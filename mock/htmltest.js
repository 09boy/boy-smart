
const data = {
	'list:1-10':[
		{
			'id|+1': Date.now(),
			'author': '@name',
			'text': '@title'
		}
	]
};

const postData = {
	method: 'post',

};

Mock.mock('/api/saveComment',postData.method,{author: 'value1',text: 'say something....', id: Date.now() + 2});

function request(){
	$.ajax({
		url: '/api/saveComment',
		type: 'post',
		data: {author: 'value1',text: 'say something....', id: Date.now() + 2},
	})
	.done(function(data) {
		console.log("success",data);
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
}

const btn = document.createElement('button');
document.body.appendChild(btn);
btn.addEventListener('click',function(){
	console.log('click');
	request();
})