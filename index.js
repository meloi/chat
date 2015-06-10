var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var cookieParser = require('cookie-parser');
//var session = require('express-session');
var morgan= require('morgan');
var uuid = require('node-uuid');
var parser = require('cookie-parser')
var session = require('express-session');
var port = process.env.PORT || 3000;
console.log('Socket.io chat app running from '+__dirname);
app.use(morgan('dev'));
app.use(parser());
app.use(session({secret:"fried-potatoes"}));
app.get('/',function(req,res){
	var id=uuid.v4();
	console.log(req.cookies);
	if(req.cookies["user-d"]==undefined){
	res.cookie('user-id',id,{httpOnly:false, maxAge: 3600000});}
	res.sendFile(__dirname+'/index.html');
});

io.on('connection',function(socket){
	console.log('a user connected');
	socket.broadcast.emit('usercon',"New User Connected");
	socket.on('chat message',function(msg){
		console.log(msg["user-id"]+" message: "+msg["msg"]);
		socket.broadcast.emit('chat message',msg["msg"]);
	});
	socket.on('nick',function(msg){
		console.log("Nick for : "+msg["user-id"]+msg["msg"]);
	});
	socket.on('disconnect',function(){
		console.log('  user disconnected');
		socket.broadcast.emit('userdiscon',"User Disconnected");
	});
});

http.listen(port,function(){
	console.log('Listening on port : ' +port );
});