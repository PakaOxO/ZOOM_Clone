const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    // emit 메소드에는 어떤 이벤트든 만들어서 발생시킬 수 있다
    socket.emit("room", { "payload": input.value }, () => {
        console.log("Server is done!!");
    });
    input.value = "";
}

/* HTML Obj */
function init() {
    form.addEventListener("submit", handleRoomSubmit);
}

/* Runtime Logic */
init();