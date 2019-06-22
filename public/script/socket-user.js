$(function() {
    var socket = io();
    
    function logParticipant(data) {
        let message = '';
        if(data.length === 1) {
            message += `there is 1 participant`
        } else {
            message += `there are ${data.length} participants`;
        }
        console.log(message);
    }

    function logCurrentConnection(users) {                
        let usersList = ''

        $('#users-container').html('');
        
        users.forEach(username => usersList += `<div class="user">${username}</div>`);
        
        $('#users-container').append(usersList);        
    }    

    socket.on('user joined', function(data) {        
        logParticipant(data);
        logCurrentConnection(data);
    })

    socket.on('user left', function(data) {        
        logParticipant(data);
        logCurrentConnection(data);
    })

    $('#name-input').submit(function(e) {
        e.preventDefault(); // prevent default submit

        // emit event: user joined 
        socket.emit('add user', $('#username').val().trim());

        // show playground button
        $('#playground-container').show();        
        // show current online user
        $('#users-online').show();
        // hide input field
        $('#name-input-container').hide();
        // clear the input value
        $('#username').val('');
        return false;
    });
});