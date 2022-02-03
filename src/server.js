import { doesNotMatch } from "assert";
import express from "express";
import http from "http";
// import WebSocket from "ws";
import SocketIO from "socket.io";

/* Server Basic Code */
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public")); // image, video, html, css, javascript와 같은 정적 파일 경로 지정
// app.use(express.static("public")); // 윗 줄은 가상의 경로를 사용하고 싶을때, 이 코드는 가상의 경로가 아닌 실제 경로를 사용할때..
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/")); // 사용자가 주소 뒤에 임의의 다른 주소를 이어 붙였을때 home으로 redirect

// http, websocket 객체 생성
const server = http.createServer(app);
// const wss = new WebSocket.Server({ server }); // http, websocket 모두를 사용하도록 설정
const io = SocketIO(server);

// 각 접속자 별 socket을 배열에 담아 관리
// const sockets = [];

// wss.on("connection", (socket) => {
//     console.log("Connected to browser ✅");
//     sockets.push(socket);
//     socket["nickname"] = "Unknown";

//     socket.on("message", (msg) => {
//         const data = JSON.parse(msg);

//         switch (data.type) {
//             case "nickname":
//                 console.log(data.payload);
//                 socket["nickname"] = data.payload;
//                 break;
//             case "message":
//                 console.log(data.payload);
//                 const msg = `${socket.nickname} : ${data.payload}`;
//                 sockets.forEach((eachSocket) => {
//                     eachSocket.send(msg)
//                 });
//         }
//     })

//     socket.on("close", () => {
//         console.log("Disconnected 🚫");
//     });
// });

io.on("connection", (socket) => {
    // Socekt.IO에서 모든 이벤트를 확인할 수 있는 메소드
    socket.onAny((event) => {
        console.log(`Socket event: ${event}`);
    });

    // Browser에서 방 입장 시에 발생하는 이벤트
    socket.on("enter_room", (roomName, browserFunction) => {
        socket.join(roomName.payload); // 주어진 socket들은 고유한 id값을 가지는데, 해당 소켓에 room값을 set하는 명령어
        browserFunction();
        socket.to(roomName.payload).emit("welcome");
    });
});

server.listen(3000, () => console.log("listening on http://localhost:3000"));