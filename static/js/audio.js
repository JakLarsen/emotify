


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

        

function updateIsPlaying(){
    console.log('updateIsPlaying called')
    if(isPlaying == true){
        isPlaying = false
        console.log(`isPlaying is now: ${isPlaying}`)
    }
    else{
        isPlaying = true
        console.log(`isPlaying is now: ${isPlaying}`)
    }
}
function updateCurrSong(songIDTarget){
    console.log('updateCurrSong called')
    currSong = songIDTarget
}
function play(songIDTarget) {
    console.log('play() called')
    let audio = document.getElementById(songIDTarget)
    console.log(`Trying to play song: ${audio}`)
    audio.volume = 0.2;
    audio.play();   
    console.log("Song playing")
}
function pause(songIDTarget){
    console.log('pause() called')
    let audio = document.getElementById(songIDTarget)
    console.log(`Trying to pause song: ${audio}`)
    audio.pause();  
    console.log("Song paused") 
}
function stop(currSongIDTarget){
    console.log('stop() called')
    console.log(`Trying to stop ${currSongIDTarget}`)

    let audio = document.getElementById(currSongIDTarget)

    console.log(audio)
    console.log(`Trying to stop song: ${audio}`)
    audio.pause();
    audio.currentTime = 0;
    console.log("Song stopped")
}
function songValidated(songIDTarget){
    console.log('songValidated() called')
    console.log(`songIDTarget: ${songIDTarget}`)
    return endsWithNumber(songIDTarget)
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
function changeCurrSongDiv(entireSongDiv){
    console.log('changeCurrSongDiv called')

    let currTitle = document.getElementById('curr-playing-song-title')
    let currArtist = document.getElementById('curr-playing-song-artist')
    let currImg = document.getElementById('curr-playing-song-img')
    let currSongData = document.getElementById('curr-song-audio-control-con').dataset
    let currSongAudio = document.querySelector('.curr-audio')
    let currHeart = document.getElementById('curr-song-heart')

    let changeToTitle = entireSongDiv.querySelector('.lib-bot-song-title-name').innerText
    let changeToArtist = entireSongDiv.querySelector('.lib-bot-song-title-artist').innerText
    let changeToImg = entireSongDiv.querySelector('#lib-bot-song-title-img').src
    let changeToSongData = entireSongDiv.id
    let changeToAudioID = entireSongDiv.firstChild.nextSibling.dataset.song
    let changeToAudioSRC = entireSongDiv.firstChild.nextSibling.dataset.src

    changeToAudioSRC = handleSRC(changeToAudioSRC)

    currTitle.innerText = `${changeToTitle}`
    currArtist.innerText = `${changeToArtist}`
    currImg.src = `${changeToImg}`
    currSongData.song = changeToSongData
    currSongAudio.id = changeToAudioID
    currSongAudio.src = changeToAudioSRC
    currHeart.src = "../static/img/heart1.png"

}
function changePrevSongDiv(currentSongDiv){
    let prevTitle = document.getElementById('prev-playing-song-title')
    let prevArtist = document.getElementById('prevplaying-song-artist')
    let prevImg = document.getElementById('prev-playing-song-img')
    let prevSongData = document.getElementById('prev-playing-con').dataset
    let prevSongAudio = document.querySelector('.prev-audio')
    let prevHeart = document.getElementById('prev-song-heart')

    console.log(currentSongDiv)

    prevTitle.innerText = 'Prev Song Test'

}
async function changeNextSongDiv(currentSongDiv){
    let nextTitle = document.getElementById('next-playing-song-title')
    let nextArtist = document.getElementById('next-playing-song-artist')
    let nextImg = document.getElementById('next-playing-song-img')
    let nextSongData = document.getElementById('next-playing-con').dataset
    let nextSongAudio = document.querySelector('.next-audio')
    let nextHeart = document.getElementById('next-song-heart')

    currID = parseInt(currentSongDiv.id)
    let currSongData = await axios.get(`/song-data/${currID}`)
    total_songs = currSongData.data.total_songs

    nextID = currID + 1
    if (total_songs == currID){
        nextID = 1
    }

    let resp = await axios.get(`/song-data/${nextID}`)

    nextTitle.innerText = resp.data.title
    nextArtist.innerText = resp.data.artist
    nextImg.src = resp.data.img
    nextSongData.song = resp.data.id
    nextSongAudio.id =  `audio_${nextID}`
    nextSongAudio.src = `../static/audio/${resp.data.file}`
    nextHeart.src = "../static/img/heart1.png"
}






                    //MAIN AUDIO HANDLER



function audioHandler(songToPlay, newSongDiv){
    //Valid Audio Target?
    if(songValidated(songToPlay)){
        //Is there already a current song?
        if (currSong){
            //Is it playing?
            if (isPlaying){
                //Is songToPlay the current song?
                if(isCurrSong(songToPlay)){
                    pause(currSong)
                    isPlaying = false
                }
                //Is it a different song?
                else{
                    stop(currSong)
                    changeCurrSongDiv(newSongDiv)
                    changePrevSongDiv(newSongDiv)
                    changeNextSongDiv(newSongDiv)
                    updateCurrSong(songToPlay)
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
                    changeCurrSongDiv(newSongDiv)
                    changePrevSongDiv(newSongDiv)
                    changeNextSongDiv(newSongDiv)
                    updateCurrSong(songToPlay)
                    play(songToPlay)
                    isPlaying = true
                } 
            }

        }
        //No current song
        else{
            changeCurrSongDiv(newSongDiv)
            changePrevSongDiv(newSongDiv)
            changeNextSongDiv(newSongDiv)
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

