/* HTML Obj */
const messageList = document.querySelector("ul");
const nicknameForm = document.querySelector("#form__nickname")
const messageForm = document.querySelector("#form__message");

// WebSocket API로 객체 생성
const socket = new WebSocket(`ws://${window.location.host}`);

// 소켓 통신 Open
socket.addEventListener("open", () => {
    console.log("Connected to server ✅");
});

// message를 받았을 때
socket.addEventListener("message", (msg) => {
    const li = document.createElement('li');
    li.innerText = msg.data;
    messageList.appendChild(li);
});

// 통신이 종료되었을 때
socket.addEventListener("close", () => {
    console.log("Disconnected from server 🚫");
});

/* Functions */
function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nicknameForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
    input.value = "";
}

function handleMsgSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("message", input.value));
    input.value = "";
}

function init() {
    nicknameForm.addEventListener("submit", handleNickSubmit);
    messageForm.addEventListener("submit", handleMsgSubmit);
}

/* Runtime Logic */
init();