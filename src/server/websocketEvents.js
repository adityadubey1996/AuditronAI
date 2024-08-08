// websocket_events.js
const EventEmitter = require('events');
const kafkaProducer = require('./kafka_producer');

class WebSocketEventEmitter extends EventEmitter {}
const webSocketEventEmitter = new WebSocketEventEmitter();

const setupWebSocketListeners = (ws, wss) => {
    // Listen for messages from the WebSocket client
    ws.on('message', (message) => {
        console.log('Received from client:', message);
        kafkaProducer.sendMessage(message);

        // Emit an event that a message was received
        webSocketEventEmitter.emit('messageReceived', message);
    });

    // Handle WebSocket connection close
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Send a welcome message to the client
    ws.send('Welcome to the WebSocket server!');
};

// Example of an event listener for messageReceived event
webSocketEventEmitter.on('messageReceived', (message) => {
    console.log('Event: messageReceived', message);
    // You can add additional logic here
});

module.exports = { setupWebSocketListeners, webSocketEventEmitter };
