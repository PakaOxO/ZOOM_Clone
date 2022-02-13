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

    select_camera.addEventListener("input", async () => {
        await getMedia(select_camera.value);
    });

    async function getCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter((device) => device.kind === "videoinput");
            const currentCamera = myStream.getVideoTracks()[0];

            console.log(cameras);
            cameras.forEach((camera) => {
                const tag_option = document.createElement("option");
                tag_option.value = camera.deviceId;
                tag_option.innerText = camera.label;
                if (currentCamera.label = camera.label) {
                    tag_option.selected = true;
                }

                select_camera.appendChild(tag_option);
            });
        } catch(e) {
            console.log(e);
        }
    }

    async function getMedia(deviceId) {
        const initialConstraints = {
            audio: true,
            video: { facingMode: "user" },
        }
        const cameraConstrains = {
            audio: true,
            video: { deviceId: { exact: deviceId } },
        }

        try {
            myStream = await navigator.mediaDevices.getUserMedia(
                deviceId ? cameraConstrains : initialConstraints
            );
            myFace.srcObject = myStream;

            if (!deviceId) await getCameras();
        } catch(e) {
            console.log(e);
        }
    }

    getMedia();
}

init();