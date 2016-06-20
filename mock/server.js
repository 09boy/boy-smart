const express = require('express');
const app = express();

app.use(express.static(process.cwd() + '/mock'));

app.get('*', function(req,res){
	console.log('all get');
	res.sendFile(__dirname + '/index.html');
});

app.post('*', function(req,res){
	console.log('all post');
});

app.listen('5678');
