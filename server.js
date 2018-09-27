

/*
Hello. Welcome to the D&D chat server. First check to see if the server is already running (server.js 6:12)
To activate the server click the run button to host.
Then click preview running application (under preview) to open the chat and drag it over to the main tabs to enlarge the page.
*/



//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
var messages = [];
var sockets = [];
var data;

io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });
    
    socket.on('makeSelfAdmin', function() {
      broadcast('makeSelfAdmin');
    });
    
    socket.on('d4', function(roll,mod,name) {
      data = {name:'Server (to ' + name + ')',text:'The d4 returned a ' + roll + ', and with a modifier of ' + mod + ' the total is ' + (roll + mod) + '.'};
      broadcast('d4');
      broadcast('message',data);
    });
    
    socket.on('d6', function(roll,mod,name) {
      data = {name:'Server (to ' + name + ')',text:'The d6 returned a ' + roll + ', and with a modifier of ' + mod + ' the total is ' + (roll + mod) + '.'};
      broadcast('d6');
      broadcast('message',data);
    });
    
    socket.on('d8', function(roll,mod,name) {
      data = {name:'Server (to ' + name + ')',text:'The d8 returned a ' + roll + ', and with a modifier of ' + mod + ' the total is ' + (roll + mod) + '.'};
      broadcast('d8');
      broadcast('message',data);
    });
    
    socket.on('d10', function(roll,mod,name) {
      data = {name:'Server (to ' + name + ')',text:'The d10 returned a ' + roll + ', and with a modifier of ' + mod + ' the total is ' + (roll + mod) + '.'};
      broadcast('d10');
      broadcast('message',data);
    });
    
    socket.on('d12', function(roll,mod,name) {
      data = {name:'Server (to ' + name + ')',text:'The d12 returned a ' + roll + ', and with a modifier of ' + mod + ' the total is ' + (roll + mod) + '.'};
      broadcast('d12');
      broadcast('message',data);
    });
    
    socket.on('d20', function(roll,mod,name) {
      data = {name:'Server (to ' + name + ')',text:'The d20 returned a ' + roll + ', and with a modifier of ' + mod + ' the total is ' + (roll + mod) + '.'};
      broadcast('d20');
      broadcast('message',data);
    });
    
    socket.on('d100', function(roll,mod,name) {
      data = {name:'Server (to ' + name + ')',text:'The d100 returned a ' + roll + ', and with a modifier of ' + mod + ' the total is ' + (roll + mod) + '.'};
      broadcast('d100');
      broadcast('message',data);
    });
    
    socket.on('music', function(datas) {
      //var sound = new Audio(datas.src);
      //sound.volume = datas.volume;
      //sound.play();
      broadcast('music',datas);
    });
    
    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });
    
    socket.on('clear', function () {
      messages = [];
      broadcast('clear');
    });
    
    socket.on('egghunt', function(name) {
      var data = {
        name: "Server",
        text: name + " found the easter egg. Good for him/her."
      };
      socket.emit('message',data);
    });

    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
/***************************
  **\\**D&D Chat**//**
  
2018-05-18 "Pre-Alpha Released" (v0.1.0)
  +Add: Chat server
  +Add: Commands
  +Add: Dice roller
  
  
  
2018-05-18 "Patch 0.1.1" (v0.1.1)
  +Edit: Minor bug fixes
  +Edit: Nicknames
  +Edit: Dice roller
  
  
  
2018-05-22 "Patch 0.1.2" (V0.1.2)
  +Edit: Minor bug fixes
  +Edit: Clear Command
  
  
  
xxxx-xx-xx "Update 0.1.3" (V0.1.3)
  +Add: Lobby music (Planned)
  +Add: Timestamps (Planned)
*************************/
/*
Credits

Scripting:
  Henrik Evers

Debugging:
  Henrik Evers

Copy and Pasting:
  Henrik Evers
  Trevor Scritzky

Playtesting:
  Henrik Evers
  Trevor Scritzky
  Ian McGuiness

Special thanks to the devs of Conversa:
https://ide.c9.io/yatrikpatel/conversa
*/