const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('🔗 مستخدم متصل:', socket.id);
    
    socket.on('verify_password', (data) => {
        if (data.password === '20082008') {
            socket.emit('access_granted');
        } else {
            socket.emit('access_denied');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 نظام نيزك الإلكتروني يعمل على المنفذ ${PORT}`);
    console.log(`🔗 الرابط: http://localhost:${PORT}`);
});
