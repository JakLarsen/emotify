                    
                    
                    
                    // GLOBALS



let playPause = document.getElementById('play-pause')
let nextBtn = document.getElementById('next-btn')
let prevBtn = document.getElementById('prev-btn')
let isPlaying = false
let currSong = null



                    //MAIN UPDATE FUNCTIONS



function updateCurrSongDiv(song){
    let currTitle = document.getElementById('curr-playing-song-title')
    let currArtist = document.getElementById('curr-playing-song-artist')
    let currImg = document.getElementById('curr-playing-song-img')
    let currSongData = document.getElementById('curr-song-audio-control-con').dataset
    let currSongAudio = document.querySelector('.curr-audio')
    let currHeart = document.getElementById('curr-song-heart')

    currTitle.innerText = song.title
    currArtist.innerText = song.artist
    currImg.src = song.img
    currSongData.songid = song.id
    currSongData.songidx = song.idx
    currSongData.pll = song.pll
    currSongAudio.id = song.id
    currSongAudio.src = `../static/audio/${song.file}`
    currHeart.src = "../static/img/heart1.png"  
}
function updateNextSongDiv(nextSong){
    let nextTitle = document.getElementById('next-playing-song-title')
    let nextArtist = document.getElementById('next-playing-song-artist')
    let nextImg = document.getElementById('next-playing-song-img')
    let nextSongData = document.getElementById('next-playing-con').dataset
    let nextSongAudio = document.querySelector('.next-audio')
    let nextHeart = document.getElementById('next-song-heart')
    let nextDuration = document.getElementById('next-playing-con').dataset    
    
    nextTitle.innerText = nextSong.title
    nextArtist.innerText = nextSong.artist
    nextImg.src = nextSong.img
    nextSongData.songid = nextSong.id
    nextSongData.songidx =  nextSong.idx
    nextSongData.pll = nextSong.pll
    nextDuration.duration = nextSong.duration
    nextSongAudio.id =  nextSong.id
    nextSongAudio.src = `../static/audio/${nextSong.file}`
    nextHeart.src = "../static/img/heart1.png"
}
function updatePrevSongDiv(prevSong){
    let prevTitle = document.getElementById('prev-playing-song-title')
    let prevArtist = document.getElementById('prev-playing-song-artist')
    let prevImg = document.getElementById('prev-playing-song-img')
    let prevSongData = document.getElementById('prev-playing-con').dataset
    let prevSongAudio = document.querySelector('.prev-audio')
    let prevHeart = document.getElementById('prev-song-heart')
    let nextDuration = document.getElementById('prev-playing-con').dataset

    prevTitle.innerText = prevSong.title
    prevArtist.innerText = prevSong.artist
    prevImg.src = prevSong.img
    prevSongData.songid = prevSong.id
    prevSongData.songidx = prevSong.idx
    prevSongData.pll = prevSong.pll
    nextDuration.duration = prevSong.duration
    prevSongAudio.id =  prevSong.id
    prevSongAudio.src = `../static/audio/${prevSong.file}`
    prevHeart.src = "../static/img/heart1.png"
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



                    //MAIN AUDIO CONTROLS



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



                    //MAIN AUDIO LOGIC



function audioHandler(song, prevSong="", nextSong=""){
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
            //IS IT A DIFFERENT SONG
            else{
                updateCurrSongDiv(song)
                updatePrevSongDiv(prevSong)
                updateNextSongDiv(nextSong)
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
            //IS IT A DIFFERENT SONG
            else{
                updateCurrSongDiv(song)
                updatePrevSongDiv(prevSong)
                updateNextSongDiv(nextSong)
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
        updatePrevSongDiv(prevSong)
        updateNextSongDiv(nextSong)
        updateCurrSong(song)
        updateDuration(song)
        play(song)
        isPlaying = true
    }
}



                    //BOT APP AUDIO EVENT HANDLERS


//GO TO NEXT SONG              
async function nextEvent(){
    if(currSong){
        let currSongIDX = parseInt(document.getElementById('next-playing-con').dataset.songidx)
        let pll = parseInt(document.getElementById('next-playing-con').dataset.pll)

        console.log(`Our New Song IDX is : ${currSongIDX}`)
        console.log(`Our playlist length is : ${pll}`)

        let nextSongIDX = ""
        if (currSongIDX == pll){
            nextSongIDX = 1
        }
        else{
            nextSongIDX = currSongIDX + 1
        }

        let prevSongIDX = ""
        if (currSongIDX == 1){
            prevSongIDX = pll
        }
        else{
            prevSongIDX = currSongIDX - 1
        }
        // console.log(`pll: ${pll}, prevSongIDX: ${prevSongIDX}, currSongIDX: ${currSongIDX}, nextSongIDX: ${nextSongIDX}`)
        let song = await getSongData(currSongIDX)
        let prevSong = await getSongData(prevSongIDX)
        let nextSong = await getSongData(nextSongIDX)

        //SEND DATA FOR UPDATES TO OUR MAIN AUDIO HANDLER
        audioHandler(song, prevSong, nextSong)
    }
}

//GO TO PREV SONG
async function prevEvent(){
    if(currSong){
        let currSongIDX = parseInt(document.getElementById('prev-playing-con').dataset.songidx)
        let pll = parseInt(document.getElementById('prev-playing-con').dataset.pll)

        let prevSongIDX = ""
        if (currSongIDX == 1){
            prevSongIDX = pll
        }
        else{
            prevSongIDX = currSongIDX - 1
        }

        let nextSongIDX = ""
        if (currSongIDX == pll){
            nextSongIDX = 1
        }
        else{
            nextSongIDX = currSongIDX + 1
        }
        // console.log(`pll: ${pll}, prevSongIDX: ${prevSongIDX}, currSongIDX: ${currSongIDX}, nextSongIDX: ${nextSongIDX}`)
        let song = await getSongData(currSongIDX)
        let prevSong = await getSongData(prevSongIDX)
        let nextSong = await getSongData(nextSongIDX)

        audioHandler(song, prevSong, nextSong)
    }
}

//PLAY OR PAUSE
function playPauseEvent(){
    console.log('playPauseEvent() called')
    if(currSong){
        audioHandler(currSong, "", "")  
    } 
}

//CLICK HANDLERS FOR BOT BUTTONS
playPause.addEventListener('click', function(evt){
    playPauseEvent()
})

nextBtn.addEventListener('click', async function(evt){
    nextEvent()
})

prevBtn.addEventListener('click', async function(evt){
    prevEvent()
})

//CLICK HANDLERS FOR BOT DIVS
$('#prev-playing-con').click(function(){
    prevEvent()
});
$('#next-playing-con').click(function(){
    nextEvent()
});
$('#curr-playing-con').click(function(){
    playPauseEvent()
});
