


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
    console.log('Our audio element to be paused_______')
    console.log(audio)
    audio.pause();  
    console.log("Song paused") 
}
function stop(currSongIDTarget){
    console.log('(8) stop() called')
    console.log(`(9) Trying to stop ${currSongIDTarget}`)

    let audio = document.getElementById(currSongIDTarget)
    console.log(document.getElementById(currSongIDTarget).parentElement)


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
    let changeToAudioID = newSongDiv.firstChild.nextSibling.dataset.song
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
    let prevTitle = document.getElementById('prev-playing-song-title')
    let prevArtist = document.getElementById('prev-playing-song-artist')
    let prevImg = document.getElementById('prev-playing-song-img')
    let prevSongData = document.getElementById('prev-playing-con').dataset
    let prevSongAudio = document.querySelector('.prev-audio')
    let prevHeart = document.getElementById('prev-song-heart')

    newID = parseInt(newSongDiv.id)
    let newSongData = await axios.get(`/song-data/${newID}`)
    total_songs = newSongData.data.total_songs

    prevID = newID - 1
    if (newID == 1){
        prevID = total_songs
    }

    let resp = await axios.get(`/song-data/${prevID}`)
    prevTitle.innerText = resp.data.title
    prevArtist.innerText = resp.data.artist
    prevImg.src = resp.data.img
    prevSongData.song = resp.data.id
    prevSongAudio.id =  `audio_${prevID}`
    prevSongAudio.src = `../static/audio/${resp.data.file}`
    prevHeart.src = "../static/img/heart1.png"
}
async function changeNextSongDiv(newSongDiv){
    let nextTitle = document.getElementById('next-playing-song-title')
    let nextArtist = document.getElementById('next-playing-song-artist')
    let nextImg = document.getElementById('next-playing-song-img')
    let nextSongData = document.getElementById('next-playing-con').dataset
    let nextSongAudio = document.querySelector('.next-audio')
    let nextHeart = document.getElementById('next-song-heart')

    newID = parseInt(newSongDiv.id)
    let newSongData = await axios.get(`/song-data/${newID}`)
    total_songs = newSongData.data.total_songs

    nextID = newID + 1
    if (total_songs == newID){
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



async function audioHandler(songToPlay, newSongDiv){
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
                    await changePrevSongDiv(newSongDiv)
                    await changeNextSongDiv(newSongDiv)
                    changeCurrSongDiv(newSongDiv)
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
                    await changePrevSongDiv(newSongDiv)
                    await changeNextSongDiv(newSongDiv)
                    changeCurrSongDiv(newSongDiv)
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

