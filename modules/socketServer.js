module.exports = function (server) {

    var io = require('socket.io')(server);

    var SocketServer = {};

    io.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });
    
    return SocketServer;
}