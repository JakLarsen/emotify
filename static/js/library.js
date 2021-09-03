


//GLOBALS



let songDiv = document.getElementById('lib-bot')



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