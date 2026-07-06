require('dotenv').config();
const mongoose = require('mongoose');
const ExchangeHistory = require('./models/ExchangeHistory');

const dummyContacts = [
  '9876543210', '8765432109', '7654321098', '6543210987', '9988776655', '8877665544'
];

async function migrate() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!');

    const records = await ExchangeHistory.find();
    console.log(`🔍 Found ${records.length} exchange history records. Starting migration...`);

    let updatedCount = 0;
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      let updated = false;

      if (!record.studentA.contactNumber) {
        record.studentA.contactNumber = dummyContacts[i % dummyContacts.length];
        updated = true;
      }
      if (!record.studentB.contactNumber) {
        record.studentB.contactNumber = dummyContacts[(i + 1) % dummyContacts.length];
        updated = true;
      }

      if (updated) {
        await record.save();
        updatedCount++;
        console.log(`  ✔ Updated record: ${record.studentA.name} ↔ ${record.studentB.name}`);
      }
    }

    console.log(`\n🎉 Migration complete! Updated ${updatedCount} records with dummy contact numbers.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
