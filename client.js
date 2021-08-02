const socket = new WebSocket('ws://localhost:8000');

socket.onopen = (event) => {
    //on connection, do something..
    socket.send("You're a mad man!!")
}

socket.onmessage = (event) => {
    //on message from server
    console.log(event.data)
}