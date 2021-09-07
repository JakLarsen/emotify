 


//GLOBALS



if(typeof songDiv == 'undefined'){
    let songDiv = document.getElementById('lib-bot')

        //MAIN LIBRARY AUDIO HANDLER

    songDiv.addEventListener("click", async function(evt){

        let entireSongDiv = evt.path[1]
        let songIDTarget = `audio_${evt.path[0].id}`

       
        console.log(`(1) Clicked a song. Sending songIDTarget: ${songIDTarget} and entiresongdiv to audiohandler().`)
        console.log(entireSongDiv)

        audioHandler(songIDTarget, entireSongDiv)
       

        
     })
}