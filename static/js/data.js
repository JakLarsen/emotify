


                    // WEBSOCKET HANDLERS




//TAKES IN A MENTAL COMMAND INPUT FROM OUR SERVER AND HANDLES ACTION LOGIC BASED ON INPUT
function update_page(input){
    //called when data_response handler receives an event (in intervals from server side)
    //updates page based on push, pull, or neutral input received

    if (input == 'neutral'){
        // nextEvent()
    }
    else if (input == 'pull'){
        // prevEvent()
    }
    else{
        // nextEvent()
        // playPauseEvent()
    }
}

/**
 * On button press -> AJAX call to /display_data route to open stream
 * */
$(function() {
    $('a#stream-btn').on('click', function(e) {
        e.preventDefault()
        $.getJSON('/display_data', function(data) {});
        return false;
    });
});


$(document).ready(function() {
    console.log('Document is ready - io server connection establishing')
    // CONNECT TO THE SOCKETIO SERVER
    var socket = io();

   //EVENT LISTENER FOR EMITS ON 'connect' - WHEN A USER CONNECTS
    socket.on('connect', function() {
        socket.emit('my_event', {data: 'I\'m connected!'});
    });

    /**
     * EVENT LISTENER FOR WEBSOCKET EMITS TO 'my_response'
     * cb is a callback function that, if passed, will be invoked on data emit to 'my_response'
     */
    socket.on('my_response', function(msg, cb) {
        $('#log').append('<br>' + $('<div/>').text('Received #' + msg.count + ': ' + msg.data).html());
        if (cb)
            cb();
    });

    /**
     * EVENT LISTENER FOR WEBSOCKET EMITS TO 'data_response' - OUR MAIN LISTENER FOR HEADSET DATA
     * SENDS ALREADY-PROCESSED MENTAL COMMAND INPUT TO A LOGIC HANDLER: update_page()
     * POPULATES DIVS WITH DATA AS WELL AS IT COMES IN
     */
    socket.on('data_response', function(msg, cb) {
        $('.data-log-number').append(`<div class="data-number">${msg.count}</div>`);
        $('.data-log-command').append(`<div class="data-command ${msg.input}">${msg.input.toUpperCase()}</div>`);
        $('.data-log-data').append(`<div class="data-data">${msg.data}</div>`);
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