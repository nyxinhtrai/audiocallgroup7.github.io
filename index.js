const server = require('http').createServer();

const io = require('socket.io')(server, {
    cors: {
    origin: "*",
    methods: ['GET', 'POST', 'PUT']
  }
});

const arrUserInfo = [];

io.on('connection', socket => {
    // Bat su kien dang ky
    socket.on('NGUOI_DUNG_DANG_KY', user => {
        console.log('connection server 3000')
        const isExist = arrUserInfo.some(e => e.ten === user.ten); // Kiem tra nguoi dung ton tai chua truoc khi cho dang ky
        socket.peerId = user.peerId;
        if (isExist) return socket.emit('DANG_KY_THAT_BAT');
        arrUserInfo.push(user);
        socket.emit('DANH_SACH_ONLINE', arrUserInfo);
        socket.broadcast.emit('CO_NGUOI_DUNG_MOI', user);
    });

    // Bat su kien ngat ket noi
    socket.on('disconnect', () => {
        const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
        arrUserInfo.splice(index, 1);
        io.emit('AI_DO_NGAT_KET_NOI', socket.peerId);
    });
});

server.listen(process.env.PORT || 3000);