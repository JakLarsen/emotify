


                    //MAIN PLAYLIST FUNCTIONS



//GET SONG DATA FROM SONG DIV TO SEND OUT TO AUDIO HANDLER
//AGAIN, THERE SHOULD IDEALLY BE A getPlaylistData() THAT QUERIES THE SELECTED PLAYLIST
//-AND CREATES AN OBJECT OF SONGS THAT WE CAN THEN getSongData(songIDX) ON
//QUERYING FOR EACH SONG, AND SCRAPING THE DOM OF ALL THINGS, IS NOT IDEAL
async function getSongData(songIDX){
    // console.log('getSongData() called')
    // console.log(`Our songIDX is : ${songIDX}`)
    let songDiv = document.getElementById(`pl-song-${songIDX}`)
    // console.log(`Our songDiv is : ${songDiv}`)
    // console.log(`Getting Playlist Data for Playlist: ${songDiv.dataset.songpl} `)
    let playlistData = await axios.get(`/playlist-data/${songDiv.dataset.songpl}`)
    // console.log(playlistData)

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
        // console.log('Bot Area Clicked')
        
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
        //CLICK TO LIKE A SONG, SEND SONG ID
        if (evt.path[0].classList.contains('pl-song-like-img')){
            let songID = evt.path[0].dataset.songid
            heartClick(songID)
        }
    })
}

//ADDS A SONG BY ID TO A PLAYLIST BY ID
async function addSongToPlaylist(playlistID, songID){
    let songToPlaylist = await axios.get(`/playlist/${playlistID}/add-song/${songID}`)
}

//RIGHT CLICK FORM ON PLAYLIST SONG HANDLER
$('.rc-pl-btn').click(async function(evt){
    // console.log('rc-pl-form clicked')

    let songID = tossSong
    // console.log(`we know tossSong from pl.js: ${tossSong}`)

    let target = evt.currentTarget.id
    let playlistID = target.substr(10)
    addSongToPlaylist(playlistID, songID)
});

//TAKES A TARGET SONG DIV ID TO MOVE FROM PLAYLIST AND FINDS HOW FAR TO USE SUBSTR METHOD TO STRIP LEFTSIDE
function findLastNumberInTargetPlaylistID(target){
    console.log('in findLastNumberInTar...')
    let ourSubVal = 17  //A 1 digit playlist id pushes one space to 17, 2 digit = 18, etc.
    //First 3 chars of id aren't mutable, so i-2 is our extended id (chars at 0,1,2)
    //I.E. pl-1-song-remove-13 is pushed 1 character by the 1
    //I.E. pl-145-song-remove-13 is pushed 3 characters by 145
    for (let i = 10; i> 0; i--){
        if (target[i] >= '0' && target[i] <='9') {
           
            return ourSubVal = 14 + i
        }
    }
    return 'subVal not found'
}

//FINDS PLAYLIST ID FROM TARGET SONG DIV ID
//FOR # PLAYLISTS < 100_000
function findPlaylistID(target){
    let counter = 0
    target = target.substr(3)
    // console.log('target', target)
    for (let i = 0; i < 5; i++){
        if (target[i] >= '0' && target[i] <='9') {
            counter += 1
        }
    }
    let ourPlaylistID = target.slice(0,counter)
    return ourPlaylistID
}

//DELETE SONG THAT YOU'VE ADDED
$('.pl-song-del-btn').click(function(evt){
    // console.log('pl-song-del-btn clicked')
    // console.log(evt)

    let target = evt.currentTarget.id
    let playlistID = findPlaylistID(target)
    let ourVal = findLastNumberInTargetPlaylistID(target)
    let ourSongID = target.substr(ourVal)

    // console.log('ourPlaylistID', playlistID)
    // console.log('songID to delete: ', ourSongID)
    midCon.load(`/playlist/${playlistID}/remove/${ourSongID}`)
});



                    //LIKE-HEART CLICK HANDLER



async function heartClick(songID){
    // console.log('Heart Clicked!')

    //CONSIDER ALTERNATIVE METHOD USING A QUERY user -> userplaylists <- playlists
    //QUERY CURRENT USER FOR THIER LIKED_SONGS_ID
    let playlistIDObj = await axios.get('/users/current/liked-songs-id')
    let playlistID = parseInt(playlistIDObj.data)

    //ADD SONG TO LIKED PLAYLIST THROUGH GENERAL ADD SONG TO PLAYLIST ROUTE
    await axios.get(`/playlist/${playlistID}/add-song/${songID}`)
}
