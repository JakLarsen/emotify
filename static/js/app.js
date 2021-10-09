


                    //GLOBALS



let midCon = $('#mid-mid-con');
let tossSong= null
let currentPlaylist = null
let lastInput = 'neutral'



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



                    //DURATION BAR


// function updateElapsed(songDuration) {
//     console.log('in updateElapsed')
//     let bar = document.getElementById("bar");   
//     console.log(bar)
//     let elapsed = 1;
//     let id = setInterval(progress, 1000);

//     function progress(){
//         console.log('in progress',elapsed)
//         if (elapsed/songDuration >= 1) {
//             console.log(elapsed/songDuration)
//             clearInterval(id);
//         } 
//         else {
//             console.log('in else')
//             elapsed += 1; 
//             console.log(elapsed)
//             bar.style.width = elapsed/songDuration * 100 +'%'; 
//             console.log(elapsed/songDuration)
//         }
//     }
// }
// updateElapsed(25)






                    //ACTIVE PLAYLIST COLOR



function handleActivePlaylistSelect(playlist){
    console.log('in handleActivePlaylistSelect', playlist)
    //REMOVE ACTIVE CLASS FROM CURRENT
    if (currentPlaylist){
        currentPlaylist.classList.remove('ml-playlist-active')
    }
    //THEN UPDATE CURRENT TO NEW CURRENT AND READD
    currentPlaylist = document.getElementById(playlist)
    currentPlaylist.classList.add('ml-playlist-active')
    
}

let playlistContainer = document.getElementById('ml-playlist-con')
playlistContainer.addEventListener('click', function(e){
    console.log('you clicked the playlist container')
    // console.log(e.target.id.substr(13))
    let playlist = e.target.id
    handleActivePlaylistSelect(playlist)
})




                    // OPEN STREAM TO HEADSET


                    
$(function() {
    $('#connect-headset').on('click', function(e) {
        e.preventDefault()
        $.getJSON('/display_data', function(data) {});
        return false;
    });
});



                     // INPUT HANDLER
/**
 * 
 * Logic to implement:
 * if isPlaying:
 *  if lastinput == push and current input == push:
 *      nextPlaylistEvent()
 *  elif current input == push
 *      nextSongEvent()
 *  else if current input == pull
 *      pauseEvent()
 * if !isPlaying:
 *  if lastinput == pull and current input == pull:
 *      prevPlaylistEvent()
 *  elif current input == pull
 *      prevSongEvent()
 *  elif current input == next
 *      playEvent()
 */


function enactInputCommand(lastInput, input){
    if (input == 'neutral'){
        console.log('NEUTRAL input received and processed.')
        lastInput = 'neutral'
    }
    else if (input == 'push'){
        console.log('PUSH input received and processed.')
        nextEvent()
        lastInput = 'push'
    }
    else if (input == 'pull'){
        console.log('PULL input received and processed.')
        prevEvent() 
        lastInput = 'pull'
    }
}



                    // WEBSOCKET HANDLERS



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



//                     //RIGHT CLICK ADD SONG TO PLAYLIST HANDLER



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