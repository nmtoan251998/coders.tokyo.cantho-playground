var express = require('express')
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

users = [];

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/user.html');
});

// Room
let numUsers = 0;

io.on('connect', function(socket) {   
    let addedUser = false;

    socket.on('add user', function(username) {
        if(addedUser) return;

        // store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;

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

    // socket.on('disconnect', function() {
    //     if(addedUser) --numUsers;

    //     socket.emit('user left', {
    //         username: socket.username,
    //         numUsers: numUsers
    //     })
    //     users.splice(
    //         parseInt(users.indexOf(socket.username)), 
    //         1);
    // });

    function updateUser(eventname, users) {
        socket.emit(eventname, users);
    }
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});