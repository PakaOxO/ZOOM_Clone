const socket = io();

/* HTML Obj Variables */
const myFace = document.querySelector("#myFace");
const btn_mute = document.querySelector("#myStream #mute");
const btn_camera = document.querySelector("#myStream #camera");


function init() {
    let myStream;
    let muted = false;
    let cameraOff = false;

    btn_mute.addEventListener("click", () => {
        if (muted) {
            btn_mute.innerText = "Mute";
            muted = false;
        } else {
            btn_mute.innerText = "Unmute";
            muted = true;
        }
    });
    btn_camera.addEventListener("click", () => {
        if (cameraOff) {
            btn_camera.innerText = "Turn Camera Off";
            cameraOff = false;
        } else {
            btn_camera.innerText = "Turn Camera On";
            cameraOff = true;
        }
    });

    async function getMedia() {
        try {
            myStream = await navigator.mediaDevices.getUserMedia(
                {
                    audio: true,
                    video: true,
                }
            );
            myFace.srcObject = myStream;
        } catch(e) {
            console.log(e);
        }
    }

    getMedia();
}

init();