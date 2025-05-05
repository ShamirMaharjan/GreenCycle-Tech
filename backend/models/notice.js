// models/Notice.js
const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  category:    { type: String, enum: ['User', 'Garbage Collector', 'Admin', 'All'], required: true },
  createdAt:   { type: Date, default: Date.now }
});

// THIS LINE IS CRUCIAL — it actually creates & exports the Model
const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
