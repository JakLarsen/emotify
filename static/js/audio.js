


                    //GLOBALS



let playPause = document.getElementById('play-pause')

let isPlaying = false
let currSong = null



                    //GENERAL HELPER FUNCTIONS



function endsWithNumber(str){
    console.log('endsWithNumber() called')
    return !isNaN(str.slice(-1))
}
function convertLastCharToInt(str){
    console.log('convertLastCharToInt() called')
    return parseInt(str.slice(-1))
}



                    //AUDIO PLAYER HELPERS

        

function songValidated(songIDTarget){
    console.log(' (3) songValidated() called')
    console.log(`songIDTarget at songValidated: ${songIDTarget}`)
    return endsWithNumber(songIDTarget)
}
function updateCurrSong(songIDTarget){
    console.log('updateCurrSong called')
    currSong = songIDTarget
}
function play(songIDTarget) {
    console.log('play() called')
    let audio = document.getElementById(songIDTarget)
    console.log(`Trying to play song: ${songIDTarget}`)
    audio.volume = 0.2;
    audio.play();   
    console.log("Song playing")
}
function pause(songIDTarget){
    console.log('pause() called')
    let audio = document.getElementById(songIDTarget)
    console.log(`Trying to pause song: ${songIDTarget}`)
    audio.pause();  
    console.log("Song paused") 
}
async function stop(currSongIDTarget){
    console.log('(8) stop() called')
    console.log(`(9) Trying to stop ${currSongIDTarget}`)

    let audio = document.getElementById(currSongIDTarget)


    console.log('Our audio element to be stopped_______')
    console.log(audio)
    audio.pause();
    audio.currentTime = 0;
    console.log("(10) Song stopped")
}
function isCurrSong(songIDTarget){
    console.log('isCurrSong() called')
    return songIDTarget == currSong
}
function handleSRC(src){
    srcFrontClip = `..${JSON.stringify(src).substr(3)}`
    newSRC = srcFrontClip.substr(0, srcFrontClip.length-1)
    return newSRC
}
//UPDATE CURRENT SONG HTML IN AUDIO APP
function changeCurrSongDiv(newSongDiv){
    console.log(`(13) changeCurrSongDiv`)

    let currTitle = document.getElementById('curr-playing-song-title')
    let currArtist = document.getElementById('curr-playing-song-artist')
    let currImg = document.getElementById('curr-playing-song-img')
    let currSongData = document.getElementById('curr-song-audio-control-con').dataset
    let currSongAudio = document.querySelector('.curr-audio')
    let currHeart = document.getElementById('curr-song-heart')

    let changeToTitle = newSongDiv.querySelector('.lib-bot-song-title-name').innerText
    let changeToArtist = newSongDiv.querySelector('.lib-bot-song-title-artist').innerText
    let changeToImg = newSongDiv.querySelector('#lib-bot-song-title-img').src
    let changeToSongData = newSongDiv.id
    console.log(`(13) new song id should be 2: ${changeToSongData}`)
    let changeToAudioID = newSongDiv.firstChild.nextSibling.dataset.song
    console.log(`(13) new song data id should be 2: ${changeToSongData}`)
    let changeToAudioSRC = newSongDiv.firstChild.nextSibling.dataset.src

    changeToAudioSRC = handleSRC(changeToAudioSRC)

    currTitle.innerText = `${changeToTitle}`
    currArtist.innerText = `${changeToArtist}`
    currImg.src = `${changeToImg}`
    currSongData.song = changeToSongData
    currSongAudio.id = changeToAudioID
    currSongAudio.src = changeToAudioSRC
    currHeart.src = "../static/img/heart1.png"

}
async function changePrevSongDiv(newSongDiv){
    console.log(`(11) changePrevSongDiv called with NEW song div object______`)
    console.log(newSongDiv)

    let prevTitle = document.getElementById('prev-playing-song-title')
    let prevArtist = document.getElementById('prev-playing-song-artist')
    let prevImg = document.getElementById('prev-playing-song-img')
    let prevSongData = document.getElementById('prev-playing-con').dataset
    let prevSongAudio = document.querySelector('.prev-audio')
    let prevHeart = document.getElementById('prev-song-heart')

    console.log(`(11) our new song id = currId: ${newSongDiv.id}`)
    console.log(`(11) It should be 2 if we're testing from 3 to 2`)
    console.log(`(11) currSong is currently should be audio_3: ${currSong}`)
    newID = parseInt(newSongDiv.id)
    console.log(`(11) Awaiting axios.get data for song at id newID: ${newID}`)
    let newSongData = await axios.get(`/song-data/${newID}`)
    total_songs = newSongData.data.total_songs

    prevID = newID - 1
    if (newID == 1){
        prevID = total_songs
    }
    console.log(`(11) Awaiting axios.get data for song at id prevID: ${prevID}`)
    let resp = await axios.get(`/song-data/${prevID}`)
    console.log(`(11) response data received`)
    console.log(`(11) Updating Title; should be Welcome to the Jungle: ${resp.data.title}`)
    prevTitle.innerText = resp.data.title
    prevArtist.innerText = resp.data.artist
    prevImg.src = resp.data.img
    console.log(`(11) Updating data-song; should be 1: ${resp.data.id}`)
    prevSongData.song = resp.data.id
    console.log(`(11) Updating audio id; should be audio_1 but just 1: ${prevID}`)
    prevSongAudio.id =  `audio_${prevID}`
    console.log(`(11) Updating audio src; should be welcometothejungle.mp3: ${resp.data.file}`)
    prevSongAudio.src = `../static/audio/${resp.data.file}`
    prevHeart.src = "../static/img/heart1.png"
}
async function changeNextSongDiv(newSongDiv){
    console.log('(12) calling changeNextSongDiv')

    let nextTitle = document.getElementById('next-playing-song-title')
    let nextArtist = document.getElementById('next-playing-song-artist')
    let nextImg = document.getElementById('next-playing-song-img')
    let nextSongData = document.getElementById('next-playing-con').dataset
    let nextSongAudio = document.querySelector('.next-audio')
    let nextHeart = document.getElementById('next-song-heart')

    newID = parseInt(newSongDiv.id)
    console.log(`(12) newID should be 2 if going from 3 to 2: ${newID}`)
    let newSongData = await axios.get(`/song-data/${newID}`)
    total_songs = newSongData.data.total_songs

    nextID = newID + 1
    if (total_songs == newID){
        nextID = 1
    }

    console.log(`(12) nextID should be 3 if going from 3 to 2: ${nextID}`)
    let resp = await axios.get(`/song-data/${nextID}`)
    console.log(`(12) response data received`)
    
    nextTitle.innerText = resp.data.title
    nextArtist.innerText = resp.data.artist
    nextImg.src = resp.data.img
    nextSongData.song = resp.data.id
    nextSongAudio.id =  `audio_${nextID}`
    nextSongAudio.src = `../static/audio/${resp.data.file}`
    nextHeart.src = "../static/img/heart1.png"
}



                    //MAIN AUDIO HANDLER



async function audioHandler(songToPlay, newSongDiv){
    //Valid Audio Target?
    console.log('(2) Calling songValidated')
    if(songValidated(songToPlay)){
        //Is there already a current song?
        if (currSong){
            console.log(`(4) checking if currSong exists (should be audio_3) currSong: ${currSong}`)
            //Is it playing?
            if (isPlaying){
                console.log(`(5) Let's say currSong is playing so isPlaying is true: ${isPlaying}`)
                //Is songToPlay the current song?
                console.log(`(6) Calling isCurrSong(songToPlay). It should be false`)
                if(isCurrSong(songToPlay)){
                    pause(currSong)
                    isPlaying = false
                }
                //Is it a different song?
                else{
                    console.log(`(7) isCurrSong is not songToPlay`)
                    console.log(`(7.5) we are calling stop sending in (${currSong})`)
                    await stop(currSong)
                    console.log(`(11) calling to changePrevSongDiv`)
                    await changePrevSongDiv(newSongDiv)
                    console.log(`(12) calling to changeNextSongDiv`)
                    await changeNextSongDiv(newSongDiv)
                    console.log(`(13) calling to changeCurrSongDiv`)
                    changeCurrSongDiv(newSongDiv)
                    console.log(`(14) calling to updateCurrSong`)
                    updateCurrSong(songToPlay)
                    console.log(`(15) calling to play songToPlay: ${songToPlay}`)
                    play(songToPlay)
                    isPlaying = true
                }
            }
            //It's not playing
            else{
                //Is songToPlay the current song? 
                if(isCurrSong(songToPlay)){
                    play(currSong)
                    isPlaying = true
                }
                //Is it a different song?
                else{
                    await changePrevSongDiv(newSongDiv)
                    await changeNextSongDiv(newSongDiv)
                    await changeCurrSongDiv(newSongDiv)
                    updateCurrSong(songToPlay)
                    play(songToPlay)
                    isPlaying = true
                } 
            }

        }
        //No current song
        else{
            await changePrevSongDiv(newSongDiv)
            await changeNextSongDiv(newSongDiv)
            await changeCurrSongDiv(newSongDiv)
            updateCurrSong(songToPlay)
            play(songToPlay)
            isPlaying = true
        }
    }
    //Song target not valid
    else{
       console.log('Not a valid audio target') 
    }
    
}



                    //BOT APP AUDIO HANDLER



playPause.addEventListener('click', function(evt){
    console.log('playpause clicked')

    let songID = evt.path[4].dataset.song
    let songToPlay = `audio_${songID}`

    audioHandler(songToPlay)    
})

