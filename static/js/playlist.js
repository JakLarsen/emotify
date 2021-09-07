










if(typeof songArea == 'undefined'){
    let songArea = document.querySelector('.pl-con')

    songArea.addEventListener('click', async function(evt){
        console.log('bot area was clicked')
        
        //IF CLICKING ON A SONG INDEX BUTTON
        //-SEND SONG DATA TO AUDIO HANDLER
        if (evt.path[0].classList.contains('pl-song-index')){
            console.log('clicked to play a song')

            let id = evt.path[1].dataset.songid
            let idx = evt.path[1].dataset.songidx
            let title = evt.path[1].dataset.songtitle
            let artist = evt.path[1].dataset.songartist
            let album = evt.path[1].dataset.songalbum
            let duration = evt.path[1].dataset.songduration
            let img = evt.path[1].dataset.songimg
            let file = evt.path[1].dataset.songfile
            let playlist = evt.path[1].dataset.songpl

            let playlistData = await axios.get(`/playlist-data/${playlist}`)
            console.log(playlistData)

            let newSong = {
                id:id,
                idx:idx,
                title:title,
                artist:artist,
                album:album,
                duration:duration,
                img:img,
                file:file,
                playlist:playlist
            }

            console.log(evt.path)

            // audioHandler(newSong)
        }
    })
}