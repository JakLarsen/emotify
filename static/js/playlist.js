





async function getSongData(songIDX){

    let songDiv = document.getElementById(`pl-song-${songIDX}`)
    let playlistData = await axios.get(`/playlist-data/${songDiv.dataset.songpl}`)

    ourSong = {
        id: songDiv.dataset.songid,
        idx: songDiv.dataset.songidx,
        title: songDiv.dataset.songtitle,
        artist: songDiv.dataset.songartist,
        album: songDiv.dataset.songalbum,
        duration: songDiv.dataset.songduration,
        img: songDiv.dataset.songimg,
        file: songDiv.dataset.songfile,
        playlist: songDiv.dataset.songpl,
        pll: playlistData.data.length
    }
    return ourSong
}

if(typeof songArea == 'undefined'){
    let songArea = document.querySelector('.pl-con')

    songArea.addEventListener('click', async function(evt){
        console.log('bot area was clicked')
        
        //IF CLICKING ON A SONG INDEX BUTTON
        //-SEND SONG DATA TO AUDIO HANDLER
        if (evt.path[0].classList.contains('pl-song-index')){
            console.log('clicked to play a song')

            let newSong = await getSongData(evt.path[1].dataset.songid)
            console.log(newSong)
        
            //CATCH NEW SONG BEING FIRST SONG TO CIRCLE AROUND FOR PREV SONG
            if (newSong.idx > 1){
                prevSongIDX = parseInt(newSong.idx)-1
            }
            else{
                prevSongIDX = newSong.pll
            }
            //CATCH NEW SONG BEING LAST SONG TO CIRCLE BACK FOR NEXT SONG
            if (newSong.idx == newSong.pll){
                nextSongIDX = 1
            }
            else{
                nextSongIDX = parseInt(newSong.idx) + 1
            }

            let prevSong = await getSongData(prevSongIDX)
            let nextSong = await getSongData(nextSongIDX)

            audioHandler(newSong, prevSong, nextSong)
        }
    })
}

//RIGHT CLICK FORM PLAYLIST FORM HANDLER

$('.rc-pl-btn').click(function(evt){
    console.log('rc-pl-form clicked')
    let target = evt.currentTarget.id
    let playlistID = target.substr(10)
    midCon.load(`/playlist/${playlistID}`)
});