require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');
const ExchangeHistory = require('./models/ExchangeHistory');

// Empty arrays for production fresh start
const students = [];
const historyRecords = [];

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!\n');

    // Clear existing data
    await Student.deleteMany({});
    await ExchangeHistory.deleteMany({});
    console.log('🧹 Database cleared successfully (Clean Production State)\n');

    console.log('🎉 Production clean state complete! Your database is empty and ready.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database clear failed:', err.message);
    process.exit(1);
  }
}

seed();
