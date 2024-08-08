const kafka = require('kafka-node');
const { v4: uuidv4 } = require('uuid');

const kafkaHost = 'localhost:9092';
const client = new kafka.KafkaClient({ kafkaHost });

const producer = new kafka.Producer(client);
const consumer = new kafka.Consumer(
    client,
    [{ topic: 'ai-document-processing-responses', partition: 0 }],
    { autoCommit: true }
);

const requestTopic = 'ai-document-processing-requests';
const responseTopic = 'ai-document-processing-responses';

// Topics to create
const topicsToCreate = [
    {
        topic: requestTopic,
        partitions: 1,
        replicationFactor: 1
    },
    {
        topic: responseTopic,
        partitions: 1,
        replicationFactor: 1
    }
];

// Create topics if they do not exist
// client.createTopics(topicsToCreate, (error, result) => {
//     if (error) {
//         console.error('Error creating Kafka topics:', error);
//     } else {
//         console.log('Kafka topics created successfully:', result);

//         // Start the Kafka client after topics are created
//     }
   

// });


const produceMessage = (message) => {
    const payloads = [
        {
            topic: requestTopic,
            messages: JSON.stringify(message),
            partition: 0
        }
    ];
    producer.send(payloads, (err, data) => {
        if (err) {
            console.error('Error sending message to Kafka:', err);
        } else {
            console.log('Message sent to Kafka:', data);
        }
    });
};

const consumeMessages = () => {
    consumer.on('message', (message) => {
        console.log('Received message from Kafka:', message);
        const data = JSON.parse(message.value);
        console.log('Processed data:', data);
    });

    consumer.on('error', (error) => {
        console.error('Error in Kafka Consumer:', error);
    });
};

const startKafkaClient = () => {
    producer.on('ready', () => {
        console.log('Kafka Producer is connected and ready.');

        // Produce a test message
        const testMessage = {
            id: uuidv4(),
            data: 'This is a test message for AI processing'
        };
        produceMessage(testMessage);
    });

    producer.on('error', (error) => {
        console.error('Error in Kafka Producer:', error);
    });

    consumeMessages();
};

startKafkaClient();
