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
    listingType: {
      type: String,
      enum: ['exchange', 'roomPartner'],
      default: 'exchange',
      index: true,
    },
    preferredHostel: {
      type: String,
      enum: ['Ramanujan Bhawan', 'Ambedkar Bhawan', 'Kasturba Bhawan', 'Kalpana Bhawan', ''],
      default: '',
    },
    roomType: {
      type: String,
      enum: ['Single Seater', 'Double Seater', 'Four Seater', '2 Seater', '3 Seater', '4 Seater', ''],
      default: '',
    },
    totalPeopleInRoom: {
      type: Number,
      min: 0,
      default: 0,
    },
    vacantSeats: {
      type: Number,
      min: 0,
      default: 0,
    },
    additionalPreferences: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
