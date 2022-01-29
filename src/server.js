import express from 'express';
import http from 'http';
import WebSocket from 'ws';

/* Server Basic Code */
const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public')); // image, video, html, css, javascript와 같은 정적 파일 경로 지정
// app.use(express.static('public')); // 윗 줄은 가상의 경로를 사용하고 싶을때, 이 코드는 가상의 경로가 아닌 실제 경로를 사용할때..
app.get('/', (_, res) => res.render('home'));
app.get('/*', (_, res) => res.redirect('/')); // 사용자가 주소 뒤에 임의의 다른 주소를 이어 붙였을때 home으로 redirect

// http, websocket 객체 생성
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // http, websocket 모두를 사용하도록 설정

// 각 접속자 별 socket을 배열에 담아 관리
const sockets = [];

wss.on('connection', (socket) => {
    sockets.push(socket);
    console.log('Connected to browser ✅');

    socket.on('message', (msg) => {
        const message = msg.toString();
        console.log(`Browser : ${message}`);
        
        sockets.forEach((eachSocket) => eachSocket.send(message));
    })

    socket.on('close', () => {
        console.log('Disconnected from browser 🚫');
    });
});

server.listen(3000, () => console.log('listening on http://localhost:3000'));