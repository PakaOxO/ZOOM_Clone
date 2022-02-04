## Zoom Video Chatting App Clone Coding
Zoom Clone using node.js, webRTC, webSockets

### Update Log
Jan 19, Add [README.md]
Jan 22, Server Setting [Node.js, Package.json...]
Jan 26, 28, 29, Update [app.js, server.js]
                Adding features 1. Send and recieve message btw server and browser.
                                2. Now, user can choose their own nickname and the nickname shows in the message list.
Jan 30, Install Socket.IO framework on prj and update server.js and app.js for using socket.io framework.
                Test. Server get msg including obj and function and execute the browser's function to browser.
Jan 31, Update [app.js, server.js, Home.pug], Add features
                1. Join a room when browser send room name to server with "join method" of Socket.IO API.
                2. When browser sending room name to server, form for room submit is hided and the room name is shown at the message form.
Feb 3, Update [app.js, server.js], Add feature
                1. Now the room member know when someone enter the room with a message
