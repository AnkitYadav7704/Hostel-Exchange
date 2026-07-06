const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const ExchangeHistory = require('../models/ExchangeHistory');
const { requireAuth } = require('../middleware/auth');

// GET /api/students/stats  (public)
router.get('/stats', async (req, res) => {
  try {
    const total = await Student.countDocuments();
    const ramanujan = await Student.countDocuments({ currentHostel: 'Ramanujan Bhawan' });
    const ambedkar = await Student.countDocuments({ currentHostel: 'Ambedkar Bhawan' });

    // Completed exchanges live in ExchangeHistory
    const completed = await ExchangeHistory.countDocuments();

    // Count perfect matches
    const wantAmbedkar = await Student.find({
      currentHostel: 'Ramanujan Bhawan',
      desiredHostel: 'Ambedkar Bhawan',
    });
    const wantRamanujan = await Student.find({
      currentHostel: 'Ambedkar Bhawan',
      desiredHostel: 'Ramanujan Bhawan',
    });
    const possibleMatches = Math.min(wantAmbedkar.length, wantRamanujan.length);

    res.json({ total, ramanujan, ambedkar, possibleMatches, completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/students  (public — search & filter)
router.get('/', async (req, res) => {
  try {
    const { search, currentHostel, desiredHostel, branch, year, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
      ];
    }
    if (currentHostel) query.currentHostel = currentHostel;
    if (desiredHostel) query.desiredHostel = desiredHostel;
    if (branch) query.branch = { $regex: branch, $options: 'i' };
    if (year) query.year = year;
    if (status) query.status = status;

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/students  (auth required — create listing)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, rollNumber, branch, year, currentHostel, desiredHostel, contactNumber } =
      req.body;

    if (currentHostel === desiredHostel) {
      return res
        .status(400)
        .json({ message: 'Current hostel and desired hostel cannot be the same.' });
    }

    // One listing per user
    const existingByUid = await Student.findOne({ uid: req.user.uid });
    if (existingByUid) {
      return res
        .status(400)
        .json({ message: 'You already have an active listing. Please remove it first.' });
    }

    // Unique roll number check
    const existingByRoll = await Student.findOne({ rollNumber: rollNumber.toUpperCase() });
    if (existingByRoll) {
      return res
        .status(400)
        .json({ message: 'A listing with this roll number already exists.' });
    }

    const student = new Student({
      uid: req.user.uid,
      email: req.user.email,
      name,
      rollNumber,
      branch,
      year,
      currentHostel,
      desiredHostel,
      contactNumber,
    });

    const saved = await student.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Roll number already exists.' });
    }
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/students/:id/status  (auth required — only owner)
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Looking for Exchange', 'Match Found'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Listing not found.' });

    // Ownership check
    if (student.uid !== req.user.uid) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own listing.' });
    }

    student.status = status;
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/students/:id  (auth required — only owner)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Listing not found.' });

    // Ownership check
    if (student.uid !== req.user.uid) {
      return res.status(403).json({ message: 'Forbidden: You can only remove your own listing.' });
    }

    await student.deleteOne();
    res.json({ message: 'Listing removed.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
