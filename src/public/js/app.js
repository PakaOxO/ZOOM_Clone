const socket = io();

/* HTML Obj Variables */
// Welcome Section
const welcome = document.querySelector("#welcome");
const frm_welcome = welcome.querySelector("form");

// Call Section
const call = document.querySelector("#call");
const myFace = document.querySelector("#myFace");
const btn_mute = document.querySelector("#myStream #mute");
const btn_camera = document.querySelector("#myStream #camera");
const select_camera = document.querySelector("#myStream #myCameras");

const peerFace = document.querySelector("#peerFace");

call.hidden = true;

/* Function init */
function init() {
    /* init Variables */
    let myStream;
    let muted = false;
    let cameraOff = false;
    let roomName = "";
    let myPeerConnection;

    /* Socket Code */
    socket.on("welcome", async () => {
        console.log("Someone joined");

        const offer = await myPeerConnection.createOffer();
        myPeerConnection.setLocalDescription(offer);
        socket.emit("offer", offer, roomName);
        console.log("Sent an offer");
    });

    // 상대방이 보낸 offer을 받아 LocalDescriptoin set
    socket.on("offer", async (offer) => {
        console.log("Received an offer");
        myPeerConnection.setRemoteDescription(offer);
        const answer = await myPeerConnection.createAnswer();
        myPeerConnection.setLocalDescription(answer);
        socket.emit("answer", answer, roomName);
        console.log("Sent an answer");
    });

    socket.on("answer", (answer) => {
        console.log("Received an answer");
        myPeerConnection.setRemoteDescription(answer);
    });

    socket.on("ice", (candidate) => {
        console.log("Received a candidate");
        myPeerConnection.addIceCandidate(candidate);
    });

    /* WebRTC Code */
    async function initCall() {
        welcome.hidden = true;
        call.hidden = false;
        await getMedia();
        makeConnection();
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

            if (!deviceId) {
                await getCameras();
            }
        } catch(e) {
            console.log(e);
        }
    }

    function makeConnection() {
        myPeerConnection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302",
                        "stun:stun3.l.google.com:19302",
                        "stun:stun4.l.google.com:19302",
                    ],
                }
            ],
        });
        myPeerConnection.addEventListener("icecandidate", (data) => {
            socket.emit("ice", data.candidate, roomName);
            console.log("Sent a candidate");
        });
        myPeerConnection.addEventListener("addstream", (data) => {
            // addstream event is deprecated and safari no support!!
            // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addstream_event
        // myPeerConnection.addEventListener("track", (data) => {
            console.log("Got an event from my peer");
            console.log("Peer's stream : ", data.stream);
            console.log("myStream : ", myStream);

            peerFace.srcObject = data.stream;
        });

        myStream.getTracks().forEach((track) => {
            myPeerConnection.addTrack(track, myStream);
        });
    }

    async function getCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter((device) => device.kind === "videoinput");
            const currentCamera = myStream.getVideoTracks()[0];

            cameras.forEach((camera) => {
                const tag_option = document.createElement("option");
                tag_option.value = camera.deviceId;
                tag_option.innerText = camera.label;


                if (currentCamera.label == camera.label) {
                    tag_option.selected = true;
                }

                select_camera.appendChild(tag_option);
            });
        } catch(e) {
            console.log(e);
        }
    }

    frm_welcome.addEventListener("submit", async (e) => {
        e.preventDefault();
        roomName = "";

        const input = frm_welcome.querySelector("input");
        await initCall();

        roomName = input.value;
        socket.emit("join_room", roomName);
        input.value = "";
    });

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
        if (myPeerConnection) {
            const videoTrack = myStream.getVideoTracks()[0];
            const videoSender = myPeerConnection.getSender().find((sender) => {
                sender.track.kind == "video";
            });
            videoSender.replaceTrack(videoTrack);
        }
    });
}

init();