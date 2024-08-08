const express = require('express');
const connectDB = require('./database/dbConnection');
const loadModels = require('./database/modellLoader');
const { initializeWebSocket } = require('./websocket_initializer');
const kafkaConsumer = require('./kafka/kafkaConsumer')
const http = require('http')
const app = express();
app.use(express.json());
const server = http.createServer(app);

loadModels();  // Dynamically load all models based on JSON schemas

app.post('/user', async (req, res) => {
  const User = mongoose.model('User');  // Retrieve the dynamically created User model
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/', async(req,res) => {
  res.json({message : 'testing'})
})
const wss = initializeWebSocket(server);


connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
    kafkaConsumer.startConsumer(wss);
  });
});
