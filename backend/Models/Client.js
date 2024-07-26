const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'vendors',
    required: true
  },
  status: {
    type: String,
    enum: ['Not Completed', 'In Progress', 'Completed'],
    default: 'Not Completed'
  },
  note: {
    type: String,
    default: ''
  }
}, {timestamps: true});

const Client = mongoose.model("clients", clientSchema);
module.exports = Client;