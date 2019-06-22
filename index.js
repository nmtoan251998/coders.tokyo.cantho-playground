var express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

users = [];

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/user.html');
});

io.on('connect', function(socket) {   
    socket.on('add user', function(username) {
        // store the username in the socket session for this client
        socket.username = username;        

        // emit user joined event to specify that a user is connected
        socket.username = username;
        users.unshift(socket.username);        
        updateUser('user joined', users);
    })        

    socket.on('disconnect', () => {        
        users.splice(
            parseInt(users.indexOf(socket.username)), 
            1);
        updateUser('user left', users);
    });

    function updateUser(eventname, users) {
        io.emit(eventname, users);
    }
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});