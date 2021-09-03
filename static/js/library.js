


//GLOBALS


if(typeof songDiv == 'undefined'){
    let songDiv = document.getElementById('lib-bot')



    //MAIN LIBRARY AUDIO HANDLER



    songDiv.addEventListener("click", function(evt){

        let entireSongDiv = evt.path[1]
        let songDivID = evt.path[0].id
        //this is the ID we want for document.getEle... to use audio. commands on
        let songIDTarget = `audio_${songDivID}`
        changeCurrSongDiv(entireSongDiv)
        audioHandler(songIDTarget)
    })
}