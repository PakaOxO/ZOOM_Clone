import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log("listening on http://localhost:3000");



const server = http.createServer(app);
// http, websocket 모두를 사용하도록 설정
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
    console.log("Connected to browser ✅");

    socket.on("message", (msg) => {
        console.log(msg.toString());
    })

    socket.on("close", () => {
        console.log("Disconnected from browser 🚫");
    });

    socket.send("Hello, I'm server socket!");
});

server.listen(3000, handleListen);