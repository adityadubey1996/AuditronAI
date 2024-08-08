const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Load and apply the schema
const schemaPath = path.join(__dirname, '..', '..', 'database', 'schemas', 'schema.json');
const schemaJson = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

const schema = new mongoose.Schema(schemaJson.fields);
const User = mongoose.model(schemaJson.name, schema);

console.log(`Loaded ${schemaJson.name} model, version ${schemaJson.version}`);

module.exports = { User };
