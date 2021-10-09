


                    // WEBSOCKET HANDLERS



/** 
 * Takes in a mental command input from our server and handles action logic based on input
 * 
*/
function update_page(input){
    console.log('in update_page', input)
    //called when data_response handler receives an event (in intervals from server side)
    //updates page based on push, pull, or neutral input received

    let log = document.getElementById('log')
    console.log(log)
    if (input == 'neutral'){
        $('#log').append('<br>' + $('<div/>').text('PAGE UPDATED ON COMMAND: ---NEUTRAL---').html());
        $('#test-color').css('background-color', 'blue');
        // nextEvent()
    }
    else if (input == 'pull'){
        $('#log').append('<br>' + $('<div/>').text('PAGE UPDATED ON COMMAND: ---PULL---').html());
        $('#test-color').css('background-color', 'yellow');
        // prevEvent()
    }
    else{
        $('#log').append('<br>' + $('<div/>').text('PAGE UPDATED ON COMMAND: ---PUSH---').html());
        $('#test-color').css('background-color', 'red');
        // nextEvent()
        // playPauseEvent()
    }
}


$(document).ready(function() {
    console.log('Document is ready - io server connection establishing')
    // Connect to the Socket.IO server.
    var socket = io();

    // Event handler for new connections.
    // The callback function is invoked when a connection with the
    // server is established.
    socket.on('connect', function() {
        socket.emit('my_event', {data: 'I\'m connected!'});
    });

    // Event handler for server sent data.
    // The callback function is invoked whenever the server emits data
    // to the client with the 'my_response' identifier. The data is then displayed in the "Received"
    // section of the page.
    socket.on('my_response', function(msg, cb) {
        $('#log').append('<br>' + $('<div/>').text('Received #' + msg.count + ': ' + msg.data).html());
        if (cb)
            cb();
    });

    // Event handler for Headset sent data (Handled by server).
    // The callback function is invoked whenever the server emits data
    // to the client with the 'data_response' identifier. The data is then displayed in the "Received"
    // section of the page.
    socket.on('data_response', function(msg, cb) {
        $('#log').append('<br>' + $('<div/>').text('HEADSET #' + msg.count + ':' + ' Input: ' + msg.input + '. Data: ' + msg.data).html());
        if (cb)
            cb();
        update_page(msg.input)
    });


    $('form#display-data').submit(function(event){
        socket.emit('display_data_request', {data: ('Clicked to display realtime data or send input to server.')});
        return false;
    });
    $('form#disconnect').submit(function(event) {
        socket.emit('disconnect_request');
        return false;
    });
});