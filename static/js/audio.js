let songDiv = document.getElementById('lib-bot')

let isPlaying = true




function play(songId) {
    let audio = document.getElementById(songId)

    if (isPlaying==true){
        isPlaying=false
        audio.volume = 0.2;
        audio.play();
    }
    else{
        isPlaying=true
        console.log(audio.currentTime)
        audio.pause()
    }
   
}

songDiv.addEventListener("click", function(evt){
    let songId = `audio_${evt.path[0].id}`
    console.log(songId)
    play(songId)    
})