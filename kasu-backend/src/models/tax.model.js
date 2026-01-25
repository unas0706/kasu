const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
  taxPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 5.0
  },
  taxInclusive: {
    type: Boolean,
    default: false
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tax', taxSchema);