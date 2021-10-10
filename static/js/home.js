//LOAD YOUR PLAYLISTS PAGE FROM HOME INTO MID CONTAINER
$('.home-your-playlist-playlist').click(function(evt){
    console.log(evt)
    let target = evt.currentTarget.id
    console.log(target)
    let playlistID = target.substr(14)
    midCon.load(`/playlist/${playlistID}`)
});
//LOAD YOUR LIKED MUSIC FROM HOME PAGE INTO MID CONTAINER
$('#home-favorites-con').click(async function(evt){
    console.log('home-favorties-con clicked')
    let playlistData = await axios.get('/users/current/liked-songs-id')
    let playlistID = parseInt(playlistData.data)
    midCon.load(`/playlist/${playlistID}`)
});