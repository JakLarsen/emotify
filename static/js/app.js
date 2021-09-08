let songToss = null


                    //GLOBALS



let midCon = $('#mid-mid-con');



                    //MAIN PAGE SWAP HANDLERS



$('#library-wrap').click(function(){
    console.log('libary Button clicked and attempt to load midCon')
    midCon.load("/playlist/1")
});
$('#home-wrap').click(function(){
    console.log('Home Button clicked and attempt to load midCon')
    midCon.load("/home")
});
$('#tl-playlist-wrap').click(function(){
    console.log('Your Playlists Button clicked and attempt to load midCon')
    midCon.load("/your-playlists")
});
$('#icon-title-link').click(function(){
    console.log('You clicked the logo')
    midCon.load("/home")
});
$('#ml-create-playlist-form').click(function(){
    console.log('You clicked the logo')
    midCon.load("/create-playlist")
});
$('.ml-playlist').click(function(evt){
    let target = evt.currentTarget.id
    let playlistID = target.substr(13)
    midCon.load(`/playlist/${playlistID}`)
});






                    // OPEN STREAM


                    
$(function() {
    $('#connect-headset').on('click', function(e) {
        e.preventDefault()
        $.getJSON('/display_data', function(data) {});
        return false;
    });
});






function discernSongDivSongID(path){
    console.log('in discernSongDivSongID')
    console.log(path)

    let songID = null

    if (path[0].classList.contains('pl-song-wrap')){
        songID = path[0].id.substr(8)
    }

    return songID
}

function putSongIDInDiv(e, songID){
    e.path[0].dataset.songID = songID
}




// RIGHT CLICK HANDLER


function hideMenu(){
    document.getElementById('rc-menu').style.display = 'none'
    document.getElementById('rc-playlists').style.display = 'none'
}
function showMenu(e){
    let menu = document.getElementById('rc-menu')
    let playlists =  document.getElementById('rc-playlists')
    
    menu.style.display = 'flex'
    menu.style.left = e.pageX-250 + 'px'
    menu.style.top = e.pageY-80 + 'px'

    playlists.style.display = 'flex'
    playlists.style.left = e.pageX-106 + 'px'
    playlists.style.top = e.pageY-80+ 'px'

}

if (document.addEventListener) {
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();

        let songID = discernSongDivSongID(e.path)
        putSongIDInDiv(e, songID)
        tossSong = songID

        //Draw right click menu

        let menu = document.getElementById('rc-menu')

        if (menu.style.display == 'flex'){
            hideMenu()
        }
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