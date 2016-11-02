var mongojs = require('mongojs');
var _ = require('underscore');
var db = mongojs('localhost:27017/myGame', ['account']);

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);

console.log("Server started.");

var SOCKET_LIST = {};

var Player = function(id, name){

    this.id = id;
    this.name = name;

    if (_.size(Player.list) == 0 ) {
      this.color = "white";
    } else if (_.size(Player.list) == 1) {
      this.color = "black";
    } else {
      this.color = "spectator";
    }
}
Player.list = {};

Player.onConnect = function(socket, name){
    Player.list[socket.id] = new Player(socket.id, name);
}
Player.onDisconnect = function(socket){
    delete Player.list[socket.id];
}

var DEBUG = true;

var isValidPassword = function(data,cb){
    db.account.find({username:data.username,password:data.password},function(err,res){
        if(res.length > 0)
            cb(true);
        else
            cb(false);
    });
}
var isUsernameTaken = function(data,cb){
    db.account.find({username:data.username},function(err,res){
        if(res.length > 0)
            cb(true);
        else
            cb(false);
    });
}
var addUser = function(data,cb){
    db.account.insert({username:data.username,password:data.password},function(err){
        cb();
    });
}



var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    socket.on('signIn',function(data){

        isValidPassword(data,function(res){
            if(res){
                socket.name = data.username;
                Player.onConnect(socket, data.username);
                socket.emit('signInResponse',{success:true});
            } else {
                socket.emit('signInResponse',{success:false});
            }
        });
    });
    socket.on('signUp',function(data){
        isUsernameTaken(data,function(res){
            if(res){
                socket.emit('signUpResponse',{success:false});
            } else {
                addUser(data,function(){
                    socket.emit('signUpResponse',{success:true});
                });
            }
        });
    });


    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });

    socket.on('sendMsgToServer', function(data){
        console.log(socket.id)
        var playerName = ( "" + socket.name +
        '(' + Player.list[socket.id].color + ')');

        for(var i in SOCKET_LIST){
            SOCKET_LIST[i].emit('addToChat',playerName + ': ' + data);
        }
    });

    socket.on('evalServer',function(data){
        if(!DEBUG)
            return;
        var res = eval(data);
        socket.emit('evalAnswer',res);
    });



});
