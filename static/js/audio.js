


                    //GLOBALS



let songDiv = document.getElementById('lib-bot')
let isPlaying = true
let currSong = null



                    //GENERAL HELPER FUNCTIONS



function endsWithNumber(str){
    return !isNaN(str.slice(-1))
}
function convertLastCharToInt(str){
    return parseInt(str.slice(-1))
}



                    //AUDIO PLAYER HELPERS



function play(songID) {
    let audio = document.getElementById(songID)

    audio.volume = 0.2;
    audio.play();   
}

function pause(songID){
    let audio = document.getElementById(songID)

    audio.pause();   
}



                    //AUDIO PLAYER HANDLERS

function changeCurrSongDiv(songDivID){

}


                   
//Takes target div id, validates it, and plays associated song
songDiv.addEventListener("click", function(evt){

    let songDivID = evt.path[0].id
    let songIDTarget = `audio_${songDivID}`
    let isProperSongID = endsWithNumber(songIDTarget)
    
    if (isProperSongID && !isPlaying){
        isPlaying = true
        currSong = songDivID
        if (songDivID != currSong){
            changeCurrSongDiv(songDivID)
        }
        play(songIDTarget)  
    }
    else{
        isPlaying = false
        pause(songIDTarget) 
        console.log('not an integer id')
    }  
})