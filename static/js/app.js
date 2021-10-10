


            //GLOBALS



let midCon = $('#mid-mid-con');
let playlistContainer = document.getElementById('ml-playlist-con');
let tossSong= null
let currentPlaylist = null



            /**
            * MAIN PAGE MID CONTENT AREA SWAP HANDLERS
            * 
            * I.E. When you click on Logo, Home, Library, Your Playlists
            *   Create Playlist, an Individual Playlist, or New Song btn, etc.
            *   The mid-mid con loads the data to display
            *   -Would benefit greatly from state management    
            */
                    


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






            /**
             * PLAYLIST CONTAINER EVENT HANDLER
             * 
             * ACTIVE PLAYLIST HIGHLIGHT
             * */



playlistContainer.addEventListener('click', function(e){
    console.log('you clicked the playlist container')
    let playlist = e.target.id

    //REMOVE ACTIVE CLASS FROM CURRENT
    if (currentPlaylist){
        currentPlaylist.classList.remove('ml-playlist-active')
    }
    //THEN UPDATE CURRENT TO NEW CURRENT AND RE-ADD
    currentPlaylist = document.getElementById(playlist)
    currentPlaylist.classList.add('ml-playlist-active')
    
})



            // OPEN STREAM TO HEADSET


                    
$(function() {
    //ON CONNECT HEADSET CLICK
    $('#connect-headset').on('click', function(e) {
        e.preventDefault()
        //SEND REQUEST TO '/display_data' in app.py
        $.getJSON('/display_data', function(data) {});
        return false;
    });
});



            /**
             * INPUT HANDLER FROM WEBSOCKET INPUT
             * 
             * When 'data_response' is emitted TO
             * -call this function to distinguish event
             * -Then call appropriate event()
             */



function enactInputCommand(input){
    if (input == 'neutral'){
        console.log('NEUTRAL input received and processed.')
        neutralEvent()
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
     * cb, a callback function, would be invoked whenever the server emits data to 'my_response'
     */
    socket.on('my_response', function(msg, cb) {
        if (cb)
            cb();
    });

    /**
     * Event listener when websocket info is emitted to 'data_response'
     * Sends mental command input that has been processed to a logic handler (enactInputCommand())
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



            //RIGHT CLICK HANDLERS



//DETERMINES THE SONG TO INTERACT WITH FROM DIFFERENT CLICKABLE ITEMS ON THE SONG DIV
function discernSongDivSongID(path){ 
    let songID = null

    //IF YOU RIGHT CLICK ON THE SONG WRAPPER
    if (path[0].classList.contains('pl-song-wrap')){
        songID = path[0].parentNode.dataset.songid
    }
    //YOU RIGHT CLICK THE ALBUM TITLE
    else if (path[0].classList.contains('pl-song-album')){
        songID = path[1].dataset.songid
    }
    //YOU RIGHT CLICK THE SONG TITLE OR ARTIST
    else if (path[0].classList.contains('pl-song-title') || path[0].classList.contains('pl-song-artist')){
        songID = path[2].dataset.songid
        console.log(songID)
    }
    //if [INSERT OTHER CLICKABLE AREAS LIKE DURATION OR IMAGE]
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

        //FIGURE OUT THE SONG ID BASED ON DIFFERENT CLICKABLE AREAS OF SONG DIV
        let songID = discernSongDivSongID(e.path)
        //GLOBAL SONG ID TO THROW TO PLAYLIST.JS - IM SURE NOT THE CORRECT WAY TO DO THIS
        tossSong = songID

        //DRAW MENU
        let menu = document.getElementById('rc-menu')
        menu.addEventListener('click', function(){
            console.log('menu clicked')
            if (menu.style.display == 'flex'){
                hideMenu()
            }
        })
        
        //IF MENU IS ALREADY PRESENT, HIDE IT
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
            || e.path[0].classList.contains('pl-song-like-img'))
            {
                //SHOW MENU
                showMenu(e) 
                //ADD LISTENER TO RIGHT CLICK PLAYLIST MENU TO CLOSE MENU ON CLICK
                let rcPlaylists = document.getElementById('rc-playlists')
                rcPlaylists.addEventListener('click', function(){
                    console.log('RIGHT CLICK PLAYLIST CLICKED')
                    if (menu.style.display == 'flex'){
                        hideMenu()
                    }
                })
            }
        }
    }, false);
} 
else {
    document.attachEvent('oncontextmenu', function(e) {
        window.event.returnValue = false;
    });
}