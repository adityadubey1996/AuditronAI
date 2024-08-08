const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const fieldTypes = {
  'String': mongoose.Schema.Types.String,
  'Number': mongoose.Schema.Types.Number,
  'Date': mongoose.Schema.Types.Date,
  'Buffer': mongoose.Schema.Types.Buffer,
  'Boolean': mongoose.Schema.Types.Boolean,
  'Mixed': mongoose.Schema.Types.Mixed,
  'ObjectId': mongoose.Schema.Types.ObjectId,
  'Array': Array,
  'Decimal128': mongoose.Schema.Types.Decimal128,
  'Map': Map,
  'Point': {
      type: String,
      enum: ['Point'],
      default: 'Point',
      coordinates: [Number]
  }
};

const loadModels = () => {
  const schemasPath = path.join(__dirname,'..','..', 'database');
  fs.readdirSync(schemasPath).forEach(file => {
    const schemaJson = JSON.parse(fs.readFileSync(path.join(schemasPath, file)));
    const schema = new mongoose.Schema(
      Object.keys(schemaJson.fields).reduce((acc, key) => {
        const fieldInfo = schemaJson.fields[key];
        acc[key] = { ...schemaJson.fields[key], type: fieldTypes[fieldInfo.type] || mongoose.Schema.Types.Mixed };
        return acc;
      }, {})
    );
    mongoose.model(schemaJson.name, schema);
  });
  console.log("Models loaded");
};

module.exports = loadModels;
