let isPlaying = false
let currSong = null

async function updateCurrSongDiv(song){
    let currTitle = document.getElementById('curr-playing-song-title')
    let currArtist = document.getElementById('curr-playing-song-artist')
    let currImg = document.getElementById('curr-playing-song-img')
    let currSongData = document.getElementById('curr-song-audio-control-con').dataset
    let currSongAudio = document.querySelector('.curr-audio')
    let currHeart = document.getElementById('curr-song-heart')

    let changeToTitle = song.title
    let changeToArtist = song.artist
    let changeToImg = song.img
    let changeToSongData = ""
    let changeToAudioID = song.id
    let changeToAudioSRC = `../static/audio/${song.file}`

    currTitle.innerText = `${changeToTitle}`
    currArtist.innerText = `${changeToArtist}`
    currImg.src = `${changeToImg}`
    currSongData.song = changeToSongData
    currSongAudio.id = changeToAudioID
    currSongAudio.src = changeToAudioSRC
    currHeart.src = "../static/img/heart1.png"  
}

function updateCurrSong(song){
    currSong = {
        id:song.id,
        idx:song.idx,
        playlist:song.playlist
    }
}

function updateDuration(song){
    let duration = song.duration
    let end = document.getElementById('end')
    end.innerText = `${Math.floor(duration/60)}:${duration%60}`
}

function play(song) {
    console.log('play() called')
    let audio = document.getElementById(song.id)
    audio.volume = 0.2;
    audio.play();   
}
function pause(currSong){
    console.log('pause() called')
    let audio = document.getElementById(currSong.id)
    audio.pause();  

}

async function audioHandler(song){
    console.log(`audioHandler() called`)
    
    //IS THERE A CURRENT SONG
    if(currSong){
        //IS IT PLAYING
        if(isPlaying){
            //IS IT THE SAME SONG
            if(currSong.id == song.id){
                //PAUSE IT
                pause(currSong)
                isPlaying = false
            }
            //IS IT A DIFF SONG
            else{
                updateCurrSongDiv(song)
                // updatePrevSongDiv(song)
                // updateNextSongDiv(song)
                updateCurrSong(song)
                updateDuration(song)
                play(song)
                isPlaying = true
            }
        }
        //IT IS NOT PLAYING
        else{
            //IS IT THE SAME SONG
            if(currSong.id == song.id){
                play(currSong)
                    isPlaying = true
            }
            //IS IT A DIFF SONG
            else{
                updateCurrSongDiv(song)
                // updatePrevSongDiv(song)
                // updateNextSongDiv(song)
                updateCurrSong(song)
                updateDuration(song)
                play(song)
                isPlaying = true
            } 
        }
    }
    //NO CURRENT SONG YET
    else{
        updateCurrSongDiv(song)
        // updatePrevSongDiv(song)
        // updateNextSongDiv(song)
        updateCurrSong(song)
        updateDuration(song)
        play(song)
        isPlaying = true
    }

}