


                    //MAIN PLAYLIST FUNCTIONS



//GET SONG DATA TO SEND OUT TO AUDIO HANDLER
async function getSongData(songIDX){
    console.log('getSongData() called')

    console.log(`Our songIDX is : ${songIDX}`)
    let songDiv = document.getElementById(`pl-song-${songIDX}`)
    console.log(`Our songDiv is : ${songDiv}`)

    console.log(`Getting Playlist Data for Playlist: ${songDiv.dataset.songpl} `)
    let playlistData = await axios.get(`/playlist-data/${songDiv.dataset.songpl}`)
    console.log(playlistData)

    songDiv.dataset.pll = playlistData.data.length

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
        pll: songDiv.dataset.pll
    }
    return ourSong
}

//SEND SONG DATA FROM PLAYLIST TO AUDIO HANDLER
if(typeof songArea == 'undefined'){
    let songArea = document.querySelector('.pl-con')

    songArea.addEventListener('click', async function(evt){
        console.log('Bot Area Clicked')
        
        //IF CLICKING ON A SONG INDEX BUTTON
        //-SEND SONG DATA TO AUDIO HANDLER
        if (evt.path[0].classList.contains('pl-song-index')){
            console.log('Song Index Clicked for Song_____')
            console.log(evt.path[1].dataset.songid)

            let newSong = await getSongData(evt.path[1].dataset.songidx)
            console.log(`newSong: ${newSong}`)
        
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

async function addSongToPlaylist(playlistID, songID){
    let songToPlaylist = await axios.get(`/playlist/${playlistID}/add-song/${songID}`)
    console.log(songToPlaylist)
}

//RIGHT CLICK FORM ON PLAYLIST SONG HANDLER
$('.rc-pl-btn').click(async function(evt){
    console.log('rc-pl-form clicked')

    let songID = tossSong
    console.log(`we know tossSong from pl.js: ${tossSong}`)

    let target = evt.currentTarget.id
    let playlistID = target.substr(10)
    addSongToPlaylist(playlistID, songID)
});

//DELETE SONG THAT YOU'VE ADDED
$('.pl-song-del-btn').click(function(evt){
    console.log('pl-song-del-btn clicked')
    console.log(evt)
    let target = evt.currentTarget.id
    let playlistID = target.substr(3).slice(0,1)
    let songID = target.substr(17).slice(0,1)
    midCon.load(`/playlist/${playlistID}/remove/${songID}`)
});
