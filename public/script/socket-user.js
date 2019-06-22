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

    socket.on('winner', function(users) {
        const winnername = `<div class="winner-name">${users[0]}</div>`;
        
        if($('.winner-name')) {
            $('.winner-name').remove();
        }
        $('#winner-container')            
            .append(winnername);
    })

    socket.on('start', function(timer) {
        const timeCounter = setInterval(() => {
            // time counter
            $('.time-counter').html(timer);            

            if(timer === 0) {
                clearInterval(timeCounter);
                // show the playground button
                $('#btn-playground').show();   
            }
            timer--;
        }, 1000)        
    })
    
    socket.on('restart', function() {
        // clear the winner
        if($('.winner-name')) {
            $('.winner-name').remove();
        }

        // show the playground button
        $('#btn-playground').hide();
    })    

    $('#name-input').submit(function(e) {
        e.preventDefault(); // prevent default submit

        // emit event: user joined 
        socket.emit('add user', $('#username').val().trim());
        
        // show action field
        $('.action-container').css('display', 'flex');        
        // hide input field
        $('#name-input-container').hide();        
        return false;
    });

    $('#btn-playground').click(function(e) {
        // prevent the page to reload
        e.preventDefault();

        // emit clicked user to the socket
        socket.emit('click', $('#username').val());
    })

    $('.start-btn').click(function(e) {
        // prevent the page to reload
        e.preventDefault();             

        socket.emit('start');
    })

    $('.restart-btn').click(function(e) {
        // prevent the page to reload
        e.preventDefault();

        timer = 3;

        // emit clicked user to the socket
        socket.emit('restart');
    })
});