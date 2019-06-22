var express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let users = [];
let clickedUsers = [];
let timer = 3;

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/user.html');
});

app.get('/admin', function(req, res) {
    res.sendFile(__dirname + '/admin.html');
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

    socket.on('click', function(username) {
        clickedUsers.push(username);

        io.emit('winner', clickedUsers);
    });

    socket.on('start', function() {
        io.emit('start', timer);
    })

    socket.on('restart', function() {
        clickedUsers.length = 0;

        io.emit('restart', clickedUsers);
    })

    function updateUser(eventname, users) {
        io.emit(eventname, users);
    }
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});