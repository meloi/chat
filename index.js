var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var cookieParser = require('cookie-parser');
//var session = require('express-session');
var morgan= require('morgan');
var uuid = require('node-uuid');
var port = process.env.PORT || 3000;
console.log('Socket.io chat app running from '+__dirname);
app.use(morgan('dev'));
app.get('/',function(req,res){
	var id=uuid.v4();
	res.cookie('user-id',id,{httpOnly:false});
	res.sendFile(__dirname+'/index.html');
});

io.on('connection',function(socket){
	console.log('a user connected');
	socket.broadcast.emit('newuser',"New User Connected");
	socket.on('chat message',function(msg){
		console.log(msg["user-id"]+" message: "+msg["msg"]);
		socket.broadcast.emit('chat message',msg["msg"]);
	});
	socket.on('nick',function(msg){
		console.log("Nick for : "+msg["user-id"]+msg["msg"]);
	});
	
	socket.on('disconnect',function(){
		console.log('  user disconnected');
	});
});

http.listen(port,function(){
	console.log('Listening on port : ' +port );
});