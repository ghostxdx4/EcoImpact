const mongoose = require('mongoose');

const TrashReportSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  beforePhoto: { type: String, required: true }, // base64 or URL after upload
  afterPhoto: { type: String },
  trashTypes: [{ type: String, required: true }],
  description: { type: String },
  isCleaned: { type: Boolean, default: false },
  points: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TrashReport', TrashReportSchema);
