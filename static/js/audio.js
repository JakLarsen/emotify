


                    //GLOBALS



let songDiv = document.getElementById('lib-bot')
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
//UPDATE CURRENT SONG TARGET
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
}
function pause(songIDTarget){
    console.log('pause() called')
    let audio = document.getElementById(songIDTarget)
    console.log(`Trying to pause song: ${audio}`)
    audio.pause();   
}
function stop(currSongIDTarget){
    console.log('stop() called')
    let audio = document.getElementById(currSongIDTarget)
    console.log(`Trying to stop song: ${audio}`)
    audio.pause();
    audio.currentTime = 0;
}
//UPDATE CURRENT SONG IN AUDIO APP
function changeCurrSongDiv(entireSongDiv){
    console.log('changeCurrSongDiv called')

    let currTitle = document.getElementById('curr-playing-song-title')
    let currArtist = document.getElementById('curr-playing-song-artist')
    let currImg = document.getElementById('curr-playing-song-img')
    let currSongData = document.getElementById('curr-song-audio-control-con').dataset

    let changeToTitle = entireSongDiv.querySelector('.lib-bot-song-title-name').innerText
    let changeToArtist = entireSongDiv.querySelector('.lib-bot-song-title-artist').innerText
    let changeToImg = entireSongDiv.querySelector('#lib-bot-song-title-img').src
    let changeToSongData = entireSongDiv.id

    currTitle.innerText = `${changeToTitle}`
    currArtist.innerText = `${changeToArtist}`
    currImg.src = `${changeToImg}`
    currSongData.song = changeToSongData
    console.log(`currSongData: ${currSongData}`)
}



                    //AUDIO PLAYER HANDLERS



function songValidated(songIDTarget){
    console.log('songValidated() called')
    return endsWithNumber(songIDTarget)
}

function isCurrSong(songIDTarget){
    console.log('isCurrSong() called')
    return songIDTarget == currSong
}

function audioHandler(songIDTarget){
    console.log('audioHandler() called')
    if(songValidated(songIDTarget)){
        if(isCurrSong(songIDTarget)){
            if(isPlaying){
                pause(songIDTarget)
            }
            else{
                play(songIDTarget)
            }
            updateIsPlaying()
        }
        else{
            if(currSong){
                stop(currSong)
            }
            updateCurrSong(songIDTarget)
            play(songIDTarget)
            updateIsPlaying()
        }
    }
    else{
        console.log('Not a proper song Div ID')
    }  
}



                    //BOT APP AUDIO HANDLER



playPause.addEventListener('click', function(evt){
    console.log('playpause clicked')
    
    console.log(evt)
    let songID = evt.path[4].dataset.song
    console.log(songID)
    let songIDTarget = `audio_${songID}`

    audioHandler(songIDTarget)    
})
