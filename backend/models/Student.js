const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: [true, 'User UID is required'],
      index: true,
    },
    email: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true,
      unique: true,
      uppercase: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    },
    currentHostel: {
      type: String,
      required: [true, 'Current hostel is required'],
      enum: ['Ramanujan Bhawan', 'Ambedkar Bhawan', 'Kasturba Bhawan', 'Kalpana Bhawan'],
    },
    desiredHostel: {
      type: String,
      required: [true, 'Desired hostel is required'],
      enum: ['Ramanujan Bhawan', 'Ambedkar Bhawan', 'Kasturba Bhawan', 'Kalpana Bhawan'],
    },
    contactNumber: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Looking for Exchange', 'Match Found', 'Exchange Completed'],
      default: 'Looking for Exchange',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
