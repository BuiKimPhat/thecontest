const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 9669;

io.on('connection', socket => {
    console.log("A user has connected!");
    socket.on('disconnect', () => {
        console.log("A user has disconnected!")
    })
    socket.on('playersubmit', data => {
        io.emit
    })
})

http.listen(9669, () => {
    console.log(`Live server listening on port ${PORT}`);
})