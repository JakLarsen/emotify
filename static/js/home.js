$('.home-your-playlist-playlist').click(function(evt){
    console.log(evt)
    let target = evt.currentTarget.id
    let playlistID = target.substr(14)
    midCon.load(`/playlist/${playlistID}`)
});