const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const room__h3 = room.querySelector("h3");

room.hidden = true;

let roomName = "";

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    room__h3.innerText = roomName;
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    // emit 메소드에는 어떤 이벤트든 만들어서 발생시킬 수 있다
    socket.emit("enter_room", { "payload": input.value }, showRoom);
    roomName = input.value;
    input.value = "";
}

/* HTML Obj */
function init() {
    form.addEventListener("submit", handleRoomSubmit);
}

/* Runtime Logic */
init();