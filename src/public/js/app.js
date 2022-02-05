const socket = io();

const welcome = document.getElementById("welcome");
const welcome__form = welcome.querySelector("form");
const room = document.getElementById("room");
const room__h3 = room.querySelector("h3");
const room__msg = room.querySelector("#msg");

room.hidden = true;

let roomName = "";
let nickname = "";

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room__msg.querySelector("input");
    const msg = input.value;
    socket.emit("new_message", roomName, input.value, () => {
        addMessage(`Me : ${msg}`);
    });
    input.value = "";
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    room__h3.innerText = `Room : ${roomName}`;
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input__roomname = welcome__form.querySelector("#roomname");
    const input__nickname = welcome__form.querySelector("#nickname");

    // emit 메소드에는 어떤 이벤트든 만들어서 발생시킬 수 있다
    roomName = input__roomname.value;
    nickname = input__nickname.value;
    socket.emit("enter_room", roomName, nickname, showRoom);
    input.value = "";
}

function addMessage(msg) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.appendChild(li);
}

/* HTML Obj */
function init() {
    welcome__form.addEventListener("submit", handleRoomSubmit);
    room__msg.addEventListener("submit", handleMessageSubmit);
    socket.on("welcome", (name) => {
        addMessage(`${name} joined`);
    });

    socket.on("bye", (name) => {
        addMessage(`${name} is left`);
    });

    socket.on("new_message", (name, msg) => {
        addMessage(`${name} : ${msg}`);
    });
}

/* Runtime Logic */
init();