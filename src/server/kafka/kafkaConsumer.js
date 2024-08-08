// kafka_consumer.js
const kafka = require('kafka-node');

const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

const topicsToCreate = [
    {
        topic: 'ai-document-processing-responses',
        partitions: 1,
        replicationFactor: 1
    },
    {
        topic: 'ai-document-processing-requests',
        partitions: 1,
        replicationFactor: 1
    }
];

client.createTopics(topicsToCreate, (error, result) => {
    if (error) {
        console.error('Error creating Kafka topics', error);
    } else {
        console.log('Kafka topics created successfully', result);
        
        // Start the consumer after topics are created
        startConsumer();
    }
});

const consumer = new kafka.Consumer(
    client,
    [{ topic: 'ai-document-processing-responses', partition: 0 }],
    { autoCommit: true }
);

const startConsumer = (wss) => {
    consumer.on('message', (message) => {
        console.log('Received message from Kafka:', message);
        const data = JSON.parse(message.value);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });

    consumer.on('error', (error) => {
        console.error('Error in Kafka Consumer', error);
    });
};

module.exports = { startConsumer };
