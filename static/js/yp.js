


//LOAD YOUR PLAYLIST THAT IS CLICKED FROM LEFT SIDEBAR INTO MID CONTAINER
$('.yp-playlist').click(function(evt){
    let target = evt.currentTarget.id
    let playlistID = target.substr(12)
    midCon.load(`/playlist/${playlistID}`)
});