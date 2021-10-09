


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



                     // WEBSOCKET HANDLERS



function enactInputCommand(input){
    if (input == 'neutral'){
        console.log('NEUTRAL input received and processed.')
    }
    else if (input == 'push'){
        console.log('PUSH input received and processed.')
        nextEvent()
    }
    else if (input == 'pull'){
        console.log('PULL input received and processed.')
        prevEvent()
    }
}
$(document).ready(function() {
    // Connect to the Socket.IO server.
    var socket = io();

    //Event listenerfor new connections.
    socket.on('connect', function() {
        socket.emit('my_event', {data: 'I\'m connected!'});
    });

    /**
     * Event listener when websocket info is emitted to 'my_response'
     * cb, a callback function, would be invoked whenever the server emits data to 'data_response'
     */
    socket.on('my_response', function(msg, cb) {
        if (cb)
            cb();
    });

    /**
     * Event listener when websocket info is emitted to 'data_response'
     * Sends mental command input that has been processed to a logic handler (update_page())
     * cb, a callback function, would be invoked whenever the server emits data to 'data_response'
     */
    socket.on('data_response', function(msg, cb) {
        if (cb)
            cb();
        enactInputCommand(msg.input)
    });

    $('form#disconnect').submit(function(event) {
        socket.emit('disconnect_request');
        return false;
    });
});



                    //RIGHT CLICK ADD SONG TO PLAYLIST HANDLER



// //DETERMINES THE SONG TO INTERACT WITH FROM DIFFERENT CLICKABLE ITEMS ON THE SONG DIV
// function discernSongDivSongID(path){ 
//     let songID = null

//     //IF YOU CLICK ON THE SONG WRAPPER
//     if (path[0].classList.contains('pl-song-wrap')){
//         songID = path[0].dataset.songid
//     }
//     //if [INSERT OTHER CLICKABLE AREAS LIKE TITLE]
//     return songID
// }

// //HIDE RIGHT CLICK MENU ON SECOND RIGHT CLICK
// function hideMenu(){
//     document.getElementById('rc-menu').style.display = 'none'
//     document.getElementById('rc-playlists').style.display = 'none'
// }
// //SHOW RIGHT CLICK MENU ON FIRST RIGHT CLICK
// function showMenu(e){
//     let menu = document.getElementById('rc-menu')
//     let playlists =  document.getElementById('rc-playlists')
    
//     menu.style.display = 'flex'
//     menu.style.left = e.pageX-250 + 'px'
//     menu.style.top = e.pageY-80 + 'px'

//     playlists.style.display = 'flex'
//     playlists.style.left = e.pageX-110 + 'px'
//     playlists.style.top = e.pageY-80+ 'px'

// }

// //MAIN RIGHT CLICK MENU HANDLER
// if (document.addEventListener) {
//     document.addEventListener('contextmenu', function(e) {
//         e.preventDefault();

//         let songID = discernSongDivSongID(e.path)
//         tossSong = songID

//         //DRAW MENU
//         let menu = document.getElementById('rc-menu')
//         menu.addEventListener('click', function(){
//             console.log('menu clicked')
//             if (menu.style.display == 'flex'){
//                 hideMenu()
//             }
//         })
        
//         if (menu.style.display == 'flex'){
//             hideMenu()
//         }
//         //IF YOU RIGHT CLICK A SONG DIV
//         else{
//             if (e.path[0].classList.contains('pl-song-wrap') 
//             || e.path[0].classList.contains('pl-song-index') 
//             || e.path[0].classList.contains('pl-song-img')
//             || e.path[0].classList.contains('pl-song-title-artist-wrap')
//             || e.path[0].classList.contains('pl-song-title')
//             || e.path[0].classList.contains('pl-song-artist')
//             || e.path[0].classList.contains('pl-song-album')
//             || e.path[0].classList.contains('pl-song-like-img'))
//             {
//                 //SHOW MENU
//                 showMenu(e) 
//                 //ADD LISTENER TO RIGHT CLICK PLAYLIST MENU TO CLOSE MENU ON CLICK
//                 let rcPlaylists = document.getElementById('rc-playlists')
//                 rcPlaylists.addEventListener('click', function(){
//                     console.log('RIGHT CLICK PLAYLIST CLICKED')
//                     if (menu.style.display == 'flex'){
//                         hideMenu()
//                     }
//                 })
//             }
//         }
//     }, false);
// } 
// else {
//     document.attachEvent('oncontextmenu', function(e) {
//         window.event.returnValue = false;
//     });
// }