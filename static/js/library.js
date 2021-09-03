


//GLOBALS


if(typeof songDiv == 'undefined'){
    let songDiv = document.getElementById('lib-bot')



    //MAIN LIBRARY AUDIO HANDLER



    songDiv.addEventListener("click", function(evt){

        let entireSongDiv = evt.path[1]
        let songIDTarget = `audio_${evt.path[0].id}`

        audioHandler(songIDTarget, entireSongDiv)
    })
}