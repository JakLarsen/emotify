


                    //GLOBALS



let midCon = $('#mid-mid-con');
let tossSong= null



                    //MAIN PAGE MID CONTENT AREA SWAP HANDLERS


//LIBRARY BUTTON
$('#library-wrap').click(function(){
    midCon.load("/playlist/1")
});
//HOME BUTTON
$('#home-wrap').click(function(){
    console.log('Home Button clicked and attempt to load midCon')
    midCon.load("/home")
});
//YOUR PLAYLISTS BUTTON
$('#tl-playlist-wrap').click(function(){
    console.log('Your Playlists Button clicked and attempt to load midCon')
    midCon.load("/your-playlists")
});
//LOGO CLICK
$('#icon-title-link').click(function(){
    console.log('You clicked the logo')
    midCon.load("/home")
});
//CREATE PLAYLIST FORM
$('#ml-create-playlist-form').click(function(){
    console.log('Create Playlist Form clicked')
    midCon.load("/create-playlist")
});
//INDIVIDUAL PLAYLISTS ON LEFT BAR
$('.ml-playlist').click(function(evt){
    let target = evt.currentTarget.id
    let playlistID = target.substr(13)
    midCon.load(`/playlist/${playlistID}`)
});
//INDIVIDUAL PLAYLISTS FROM HOME PAGE
$('.home-your-playlist-playlist').click(function(evt){
    console.log(evt)
    let target = evt.currentTarget.id
    let playlistID = target.substr(14)
    midCon.load(`/playlist/${playlistID}`)
});



                    // OPEN STREAM TO HEADSET


                    
$(function() {
    $('#connect-headset').on('click', function(e) {
        e.preventDefault()
        $.getJSON('/display_data', function(data) {});
        return false;
    });
});



//                     // WEBSOCKET HANDLERS



// function update_page(input){
//     //called when data_response handler receives an event (in intervals from server side)
//     //updates page based on push, pull, or neutral input received
//     if (input == 'push'){
//         $('#log').append('<br>' + $('<div/>').text('PAGE UPDATED ON PUSH COMMAND').html());
//         // $('#mid-mid-con').css('background-color', 'blue');
//         nextEvent()
//     }
//     else if (input == 'pull'){
//         $('#log').append('<br>' + $('<div/>').text('PAGE UPDATED ON PULL COMMAND').html());
//         // $('#mid-mid-con').css('background-color', 'yellow');
//         // prevEvent()
//     }
//     else{
//         $('#log').append('<br>' + $('<div/>').text('PAGE UPDATED ON NEUTRAL COMMAND').html());
//         $('#mid-mid-con').css('background-color', 'red');
//         // nextEvent()
//         // playPauseEvent()
//     }
// }
// $(document).ready(function() {
//     // Connect to the Socket.IO server.
//     var socket = io();

//     // Event handler for new connections.
//     // The callback function is invoked when a connection with the
//     // server is established.
//     socket.on('connect', function() {
//         socket.emit('my_event', {data: 'I\'m connected!'});
//     });

//     // Event handler for server sent data.
//     // The callback function is invoked whenever the server emits data
//     // to the client with the 'my_response' identifier. The data is then displayed in the "Received"
//     // section of the page.
//     socket.on('my_response', function(msg, cb) {
//         $('#log').append('<br>' + $('<div/>').text('Received #' + msg.count + ': ' + msg.data).html());
//         if (cb)
//             cb();
//     });

//     // Event handler for Headset sent data (Handled by server).
//     // The callback function is invoked whenever the server emits data
//     // to the client with the 'data_response' identifier. The data is then displayed in the "Received"
//     // section of the page.
//     socket.on('data_response', function(msg, cb) {
//         $('#log').append('<br>' + $('<div/>').text('HEADSET #' + msg.count + ':' + ' Input: ' + msg.input + '. Data: ' + msg.data).html());
//         if (cb)
//             cb();
//         update_page(msg.input)
//     });


//     $('form#display-data').submit(function(event){
//         socket.emit('display_data_request', {data: ('Clicked to display realtime data or send input to server.')});
//         return false;
//     });
//     $('form#disconnect').submit(function(event) {
//         socket.emit('disconnect_request');
//         return false;
//     });
// });



                    //RIGHT CLICK ADD SONG TO PLAYLIST HANDLER



//DETERMINES THE SONG TO INTERACT WITH FROM DIFFERENT CLICKABLE ITEMS ON THE SONG DIV
function discernSongDivSongID(path){ 
    let songID = null

    //IF YOU CLICK ON THE SONG WRAPPER
    if (path[0].classList.contains('pl-song-wrap')){
        songID = path[0].dataset.songid
    }
    //if [INSERT OTHER CLICKABLE AREAS LIKE TITLE]
    return songID
}

//HIDE RIGHT CLICK MENU ON SECOND RIGHT CLICK
function hideMenu(){
    document.getElementById('rc-menu').style.display = 'none'
    document.getElementById('rc-playlists').style.display = 'none'
}
//SHOW RIGHT CLICK MENU ON FIRST RIGHT CLICK
function showMenu(e){
    let menu = document.getElementById('rc-menu')
    let playlists =  document.getElementById('rc-playlists')
    
    menu.style.display = 'flex'
    menu.style.left = e.pageX-250 + 'px'
    menu.style.top = e.pageY-80 + 'px'

    playlists.style.display = 'flex'
    playlists.style.left = e.pageX-110 + 'px'
    playlists.style.top = e.pageY-80+ 'px'

}

//MAIN RIGHT CLICK MENU HANDLER
if (document.addEventListener) {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();

        let songID = discernSongDivSongID(e.path)
        tossSong = songID

        //DRAW MENU
        let menu = document.getElementById('rc-menu')
        if (menu.style.display == 'flex'){
            hideMenu()
        }
        //IF YOU RIGHT CLICK A SONG DIV
        else{
            if (e.path[0].classList.contains('pl-song-wrap') 
            || e.path[0].classList.contains('pl-song-index') 
            || e.path[0].classList.contains('pl-song-img')
            || e.path[0].classList.contains('pl-song-title-artist-wrap')
            || e.path[0].classList.contains('pl-song-title')
            || e.path[0].classList.contains('pl-song-artist')
            || e.path[0].classList.contains('pl-song-album')
            || e.path[0].classList.contains('pl-song-like-img')
            ){
                showMenu(e)   
             }
        }
    }, false);
} 
else {
    document.attachEvent('oncontextmenu', function(e) {
        window.event.returnValue = false;
    });
}