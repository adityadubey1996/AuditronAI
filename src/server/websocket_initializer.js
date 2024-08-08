// websocket.js
const WebSocket = require('ws');

const initializeWebSocket = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', ws => {
        console.log('Client connected');
        ws.on('message', message => {
            console.log('Received:', message);
        });
    });

    return wss;
};

module.exports = { initializeWebSocket };
