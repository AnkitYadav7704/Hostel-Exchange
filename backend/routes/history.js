const express = require('express');
const router = express.Router();
const ExchangeHistory = require('../models/ExchangeHistory');
const Student = require('../models/Student');
const { requireAuth } = require('../middleware/auth');

// GET /api/history — all completed exchanges (public)
router.get('/', async (req, res) => {
  try {
    const history = await ExchangeHistory.find().sort({ exchangeDate: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/history — record a completed exchange and remove both students (auth required)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { studentAId, studentBId } = req.body;

    const studentA = await Student.findById(studentAId);
    const studentB = await Student.findById(studentBId);

    if (!studentA || !studentB) {
      return res.status(404).json({ message: 'One or both students not found.' });
    }

    // Ownership check: confirming user must be one of the matched students
    if (studentA.uid !== req.user.uid && studentB.uid !== req.user.uid) {
      return res.status(403).json({
        message: 'Forbidden: You can only confirm exchanges that you are a part of.',
      });
    }

    // Create history record with a full snapshot
    const record = new ExchangeHistory({
      studentA: {
        name: studentA.name,
        rollNumber: studentA.rollNumber,
        branch: studentA.branch,
        year: studentA.year,
      },
      studentB: {
        name: studentB.name,
        rollNumber: studentB.rollNumber,
        branch: studentB.branch,
        year: studentB.year,
      },
      oldHostelA: studentA.currentHostel,
      oldHostelB: studentB.currentHostel,
      exchangeDate: new Date(),
    });

    await record.save();

    // Remove both students from listings — their data lives on in ExchangeHistory
    await Student.findByIdAndDelete(studentAId);
    await Student.findByIdAndDelete(studentBId);

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
