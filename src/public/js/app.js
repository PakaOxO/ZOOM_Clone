const socket = io();

/* HTML Obj Variables */
const myFace = document.querySelector("#myFace");
const btn_mute = document.querySelector("#myStream #mute");
const btn_camera = document.querySelector("#myStream #camera");
const select_camera = document.querySelector("#myStream #myCameras");


function init() {
    let myStream;
    let muted = false;
    let cameraOff = false;

    btn_mute.addEventListener("click", () => {
        myStream.getAudioTracks().forEach((track) => track.enabled = !track.enabled);

        if (muted) {
            btn_mute.innerText = "Mute";
            muted = false;
        } else {
            btn_mute.innerText = "Unmute";
            muted = true;
        }
    });
    btn_camera.addEventListener("click", () => {
        myStream.getVideoTracks().forEach((track) => track.enabled = !track.enabled);

        if (cameraOff) {
            btn_camera.innerText = "Turn Camera Off";
            cameraOff = false;
        } else {
            btn_camera.innerText = "Turn Camera On";
            cameraOff = true;
        }
    });

    async function getCamearas() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter((device) => device.kind === "videoinput");

            console.log(cameras);
            cameras.forEach((camera) => {
                const tag_option = document.createElement("option");
                tag_option.value = camera.deviceId;
                tag_option.innerText = camera.label;

                select_camera.appendChild(tag_option);
            });
        } catch(e) {
            console.log(e);
        }
    }

    async function getMedia() {
        try {
            myStream = await navigator.mediaDevices.getUserMedia(
                {
                    audio: true,
                    video: true,
                }
            );
            myFace.srcObject = myStream;
            await getCamearas();
        } catch(e) {
            console.log(e);
        }
    }

    getMedia();
}

init();