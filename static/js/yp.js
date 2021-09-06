                    // PLAYLIST POPULATE HANDLER



$('.yp-playlist').click(function(evt){
    let target = evt.currentTarget.id
    let playlistID = target.substr(12)
    midCon.load(`/playlist/${playlistID}`)
});