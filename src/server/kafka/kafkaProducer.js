// kafka_producer.js
const kafka = require('kafka-node');

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
const producer = new kafka.Producer(client);

producer.on('ready', () => {
    console.log('Kafka Producer is connected and ready.');
});

producer.on('error', (error) => {
    console.error('Error in Kafka Producer', error);
});

const sendMessage = (message) => {
    const payloads = [
        { topic: 'ai-document-processing-requests', messages: message }
    ];
    producer.send(payloads, (err, data) => {
        if (err) {
            console.error('Error sending message to Kafka', err);
        } else {
            console.log('Message sent to Kafka', data);
        }
    });
};

module.exports = { sendMessage };
