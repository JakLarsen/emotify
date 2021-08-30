


                    //GLOBALS



let songDiv = document.getElementById('lib-bot')
let playPause = document.getElementById('play-pause')

let isPlaying = false
let currSong = null



                    //GENERAL HELPER FUNCTIONS



function endsWithNumber(str){
    return !isNaN(str.slice(-1))
}
function convertLastCharToInt(str){
    return parseInt(str.slice(-1))
}



                    //AUDIO PLAYER HELPERS


function updateIsPlaying(){
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
    currSong = songIDTarget
}
function play(songIDTarget) {
    let audio = document.getElementById(songIDTarget)
    console.log(`Trying to play song: ${audio}`)
    audio.volume = 0.2;
    audio.play();   
}

function pause(songIDTarget){
    let audio = document.getElementById(songIDTarget)
    console.log(`Trying to pause song: ${audio}`)
    audio.pause();   
}
function stop(currSongIDTarget){
    let audio = document.getElementById(currSongIDTarget)
    console.log(`Trying to stop song: ${audio}`)
    audio.pause();
    audio.currentTime = 0;
    
}
//UPDATE CURRENT SONG IN AUDIO APP
function changeCurrSongDiv(entireSongDiv){
    console.debug('changeCurrSongDiv called')

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
    return endsWithNumber(songIDTarget)
}

function isCurrSong(songIDTarget){
    return songIDTarget == currSong
}

function audioHandler(songIDTarget){
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
      


//MAIN LIBRARY AUDIO HANDLER

songDiv.addEventListener("click", function(evt){

    let entireSongDiv = evt.path[1]
    let songDivID = evt.path[0].id
    //this is the ID we want for document.getEle... to use audio. commands on
    let songIDTarget = `audio_${songDivID}`
    let isProperSongID = endsWithNumber(songIDTarget)
    
    //Did we target a proper songDiv?       
    if (isProperSongID){
        console.log('We clicked a proper song ID')
        //Is it the previously targetted songDiv that is already playing or paused?
        //-Then pause/play it and update isPlaying
        if (songIDTarget == currSong){
            console.log(`Our target: ${songIDTarget} is the same as current song: ${currSong}`)
            if (isPlaying){
                pause(songIDTarget)
            }
            else{
                play(songIDTarget)
            }
            updateIsPlaying()
        }   
        //Is it another song we are trying to play?
        //-stop current song, update playing div to new song, play new song
        //-update isPlaying
        else{
            console.log('We are trying to play a different song')
            //If a currSong is being played, stop it before playing new song
            if (currSong){
                console.log(`currSong is ${currSong}`)
                stop(currSong)
            }
            changeCurrSongDiv(entireSongDiv)
            console.log(`SongIDTarget is: ${songIDTarget}`)
            updateCurrSong(songIDTarget)
            play(songIDTarget)
            updateIsPlaying()
        }
    }
    else{
        console.log('Not a proper song Div ID')
    }  
})



//BOT APP AUDIO HANDLER



playPause.addEventListener('click', function(evt){
    console.log(evt)
    let songID = evt.path[4].dataset.song
    console.log(songID)
    let songIDTarget = `audio_${songID}`

    audioHandler(songIDTarget)    
})
