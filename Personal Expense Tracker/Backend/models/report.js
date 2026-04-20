const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  generatedDate: {
    type: Date,
    default: Date.now
  },
  details: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Report', reportSchema);
