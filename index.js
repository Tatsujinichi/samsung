var express = require('express');
var app = express();

app.use(express.static(__dirname + '/www'));

app.get('/', function(req, res) {
	res.sendFile(path.join('www' + '/index.html'));
});

app.listen(8080, function () {
	console.log('listening');
});