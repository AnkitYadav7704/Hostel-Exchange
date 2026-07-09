const mongoose = require('mongoose');

const exchangeHistorySchema = new mongoose.Schema(
  {
    studentA: {
      uid: String,
      name: String,
      rollNumber: String,
      branch: String,
      year: String,
      contactNumber: String,
    },
    studentB: {
      uid: String,
      name: String,
      rollNumber: String,
      branch: String,
      year: String,
      contactNumber: String,
    },
    oldHostelA: {
      type: String,
      enum: ['Ramanujan Bhawan', 'Ambedkar Bhawan', 'Kasturba Bhawan', 'Kalpana Bhawan'],
      required: true,
    },
    oldHostelB: {
      type: String,
      enum: ['Ramanujan Bhawan', 'Ambedkar Bhawan', 'Kasturba Bhawan', 'Kalpana Bhawan'],
      required: true,
    },
    exchangeDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExchangeHistory', exchangeHistorySchema);
