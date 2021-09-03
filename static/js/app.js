


                    //GLOBALS



let midCon = $('#mid-mid-con');



                    //MAIN PAGE SWAP HANDLERS



$('#library-wrap').click(function(){
    console.log('libary Button clicked and attempt to load midCon')
    midCon.load("/library")
});
$('#home-wrap').click(function(){
    console.log('Home Button clicked and attempt to load midCon')
    midCon.load("/home")
});
$('#tl-playlist-wrap').click(function(){
    console.log('Your Playlists Button clicked and attempt to load midCon')
    midCon.load("/your-playlists")
});
$('#icon-title-link').click(function(){
    console.log('You clicked the logo')
    midCon.load("/home")
});
$('#ml-create-playlist-form').click(function(){
    console.log('You clicked the logo')
    midCon.load("/create-playlist")
});


