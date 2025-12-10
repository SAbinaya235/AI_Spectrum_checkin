// seed.js
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/b2";

const participantSchema = new mongoose.Schema({
  registration_id: String,
  name: String,
  email: String,
  phone: String,
  paper_title: String,
  college_name: String,
  scanned_successful: Boolean,
  attendance_time: Date
});

const Participant = mongoose.model('Participant', participantSchema, 'attendance');

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  const sample = [
    {
      registration_id: "REG001",
      name: "Ananya Rao",
      email: "ananya@example.com",
      phone: "9876543210",
      paper_title: "AI for Skimmer Detection",
      college_name: "ABC College",
      scanned_successful: false,
      attendance_time: null
    },
    {
        registration_id: 'REG002',
        name: 'Banu',
        email: 'banu@example.com',
        phone: '1239876540',
        paper_title: 'Blockchain in healthcare',
        college_name: 'AsC College',
        scanned_successful: false,
        attendance_time: null
    },
    {
      registration_id: 'REG003',
        name: 'Charan',
        email: 'charan@example.com',
        phone: '1432676540',
        paper_title: 'Logistics healthcare',
        college_name: 'SAC College',
        scanned_successful: false,
        attendance_time: null
    },
    {
        registration_id: 'REG004',
        name: 'Deepak',
        email: 'deepak@example.com',
        phone: '6432676540',
        paper_title: 'NLP analysis',
        college_name: 'SMA College',
        scanned_successful: false,
        attendance_time: null
    }
  ];

  for (const entry of sample) {
    await Participant.updateOne(
      { registration_id: entry.registration_id },
      { $set: entry },
      { upsert: true }
    );
  }

  console.log("Sample data inserted.");
  mongoose.disconnect();
}

seed();
