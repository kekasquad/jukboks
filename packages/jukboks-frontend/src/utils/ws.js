import { io } from 'socket.io-client';

const WS_BASE = 'ws://localhost:8080';

const socket = io(WS_BASE, { transports: ["websocket"], autoConnect: false });

socket.on("connect", () => {
    console.log("conected, socket id: " + socket.id);
});

socket.on("disconnect", () => {
    console.log("disconnected from socket");
});

socket.on("message", (message) => {
    //TODO: send received song to Stream view
    console.log(message);
});

function connectToSocket() {
    socket.connect();
}

function disconnectFromSocket() {
    socket.disconnect();
}

export { connectToSocket, disconnectFromSocket };
