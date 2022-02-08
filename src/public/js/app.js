const socket = io();

const welcome = document.getElementById("welcome");
const welcome__form = welcome.querySelector("form");
const welcome__h3 = welcome.querySelector("h3");
const roomList = welcome.querySelector("#roomList");

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

function showRoom(cnt_users) {
    welcome.hidden = true;
    room.hidden = false;
    room__h3.innerText = `Room : ${roomName}(${cnt_users})`;
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input__roomname = welcome__form.querySelector("#roomname");
    const input__nickname = welcome__form.querySelector("#nickname");

    // emit 메소드에는 어떤 이벤트든 만들어서 발생시킬 수 있다
    roomName = input__roomname.value;
    nickname = input__nickname.value;
    socket.emit("enter_room", roomName, nickname, showRoom);
    input__roomname.value = "";
    input__nickname.value = "";
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
    socket.on("welcome", (name, cnt_users) => {
        addMessage(`${name} joined`);
        room__h3.innerText = `Room : ${roomName}(${cnt_users})`;
    });

    socket.on("bye", (name, cnt_users) => {
        addMessage(`${name} is left`);
        room__h3.innerText = `Room : ${roomName}(${cnt_users})`;
    });

    socket.on("new_message", (name, msg) => {
        addMessage(`${name} : ${msg}`);
    });

    socket.on("change_room", (publicRooms) => {
        roomList.innerHTML = "";
        welcome__h3.innerText = `Rooms : ${publicRooms.length}`;
        if (publicRooms.length === 0) return;

        publicRooms.forEach((room) => {
            const li = document.createElement("li");
            li.innerText = room;
            roomList.appendChild(li);
        });
    });
}

/* Runtime Logic */
init();