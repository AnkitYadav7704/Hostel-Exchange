const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const ExchangeHistory = require('../models/ExchangeHistory');
const { requireAuth } = require('../middleware/auth');

const ROOM_CAPACITY = {
  'Single Seater': 1,
  'Double Seater': 2,
  'Four Seater': 4,
};

// GET /api/students/stats  (public)
router.get('/stats', async (req, res) => {
  try {
    const total = await Student.countDocuments({ listingType: 'exchange' });
    const ramanujan = await Student.countDocuments({ currentHostel: 'Ramanujan Bhawan', listingType: 'exchange' });
    const ambedkar = await Student.countDocuments({ currentHostel: 'Ambedkar Bhawan', listingType: 'exchange' });
    const kasturba = await Student.countDocuments({ currentHostel: 'Kasturba Bhawan', listingType: 'exchange' });
    const kalpana = await Student.countDocuments({ currentHostel: 'Kalpana Bhawan', listingType: 'exchange' });

    // Completed exchanges live in ExchangeHistory
    const completed = await ExchangeHistory.countDocuments();

    // Count perfect matches (boys)
    const wantAmbedkar = await Student.countDocuments({
      currentHostel: 'Ramanujan Bhawan',
      desiredHostel: 'Ambedkar Bhawan',
      status: 'Looking for Exchange',
    });
    const wantRamanujan = await Student.countDocuments({
      currentHostel: 'Ambedkar Bhawan',
      desiredHostel: 'Ramanujan Bhawan',
      status: 'Looking for Exchange',
    });
    const possibleBoysMatches = Math.min(wantAmbedkar, wantRamanujan);

    // Count perfect matches (girls)
    const wantKalpana = await Student.countDocuments({
      currentHostel: 'Kasturba Bhawan',
      desiredHostel: 'Kalpana Bhawan',
      status: 'Looking for Exchange',
    });
    const wantKasturba = await Student.countDocuments({
      currentHostel: 'Kalpana Bhawan',
      desiredHostel: 'Kasturba Bhawan',
      status: 'Looking for Exchange',
    });
    const possibleGirlsMatches = Math.min(wantKalpana, wantKasturba);

    const possibleMatches = possibleBoysMatches + possibleGirlsMatches;

    res.json({ total, ramanujan, ambedkar, kasturba, kalpana, possibleMatches, completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/students/me  (auth required — get user's profile and match details)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const student = await Student.findOne({ uid: req.user.uid, listingType: 'exchange' });
    if (!student) {
      const completedExchange = await ExchangeHistory.findOne({
        $or: [
          { 'studentA.uid': req.user.uid },
          { 'studentB.uid': req.user.uid }
        ]
      }).sort({ createdAt: -1 });

      return res.json({ student: null, partner: null, completedExchange });
    }

    // Compute matches to find the partner
    let partner = null;

    if (student.currentHostel === 'Ramanujan Bhawan' || student.currentHostel === 'Ambedkar Bhawan') {
      const groupA = await Student.find({
        currentHostel: 'Ramanujan Bhawan',
        desiredHostel: 'Ambedkar Bhawan',
        status: 'Looking for Exchange',
        listingType: 'exchange',
      }).sort({ createdAt: 1 });

      const groupB = await Student.find({
        currentHostel: 'Ambedkar Bhawan',
        desiredHostel: 'Ramanujan Bhawan',
        status: 'Looking for Exchange',
        listingType: 'exchange',
      }).sort({ createdAt: 1 });

      const matchCount = Math.min(groupA.length, groupB.length);
      for (let i = 0; i < matchCount; i++) {
        if (groupA[i]._id.equals(student._id)) {
          partner = groupB[i];
          break;
        }
        if (groupB[i]._id.equals(student._id)) {
          partner = groupA[i];
          break;
        }
      }
    } else if (student.currentHostel === 'Kasturba Bhawan' || student.currentHostel === 'Kalpana Bhawan') {
      const groupC = await Student.find({
        currentHostel: 'Kasturba Bhawan',
        desiredHostel: 'Kalpana Bhawan',
        status: 'Looking for Exchange',
        listingType: 'exchange',
      }).sort({ createdAt: 1 });

      const groupD = await Student.find({
        currentHostel: 'Kalpana Bhawan',
        desiredHostel: 'Kasturba Bhawan',
        status: 'Looking for Exchange',
        listingType: 'exchange',
      }).sort({ createdAt: 1 });

      const matchCount = Math.min(groupC.length, groupD.length);
      for (let i = 0; i < matchCount; i++) {
        if (groupC[i]._id.equals(student._id)) {
          partner = groupD[i];
          break;
        }
        if (groupD[i]._id.equals(student._id)) {
          partner = groupC[i];
          break;
        }
      }
    }

    res.json({ student, partner });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/students  (public — search & filter)
router.get('/', async (req, res) => {
  try {
    const { search, currentHostel, desiredHostel, branch, year, status, listingType } = req.query;
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
    if (listingType) query.listingType = listingType;

    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/students  (auth required — create or update user's listing)
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      name,
      rollNumber,
      branch,
      year,
      currentHostel,
      desiredHostel,
      contactNumber,
      listingType = 'exchange',
      preferredHostel,
      roomType,
      totalPeopleInRoom,
      vacantSeats,
      additionalPreferences,
    } = req.body;

    if (!['exchange', 'roomPartner'].includes(listingType)) {
      return res.status(400).json({ message: 'Invalid listing type.' });
    }

    if (listingType === 'exchange' && currentHostel === desiredHostel) {
      return res
        .status(400)
        .json({ message: 'Current hostel and desired hostel cannot be the same.' });
    }

    const validSwaps = {
      'Ramanujan Bhawan': 'Ambedkar Bhawan',
      'Ambedkar Bhawan': 'Ramanujan Bhawan',
      'Kasturba Bhawan': 'Kalpana Bhawan',
      'Kalpana Bhawan': 'Kasturba Bhawan',
    };

    if (validSwaps[currentHostel] !== desiredHostel) {
      return res.status(400).json({
        message: `Incompatible swap request. ${currentHostel} can only be exchanged with ${validSwaps[currentHostel] || 'its counterpart'}.`,
      });
    }

    if (listingType === 'roomPartner') {
      const total = Number(totalPeopleInRoom);
      const vacant = Number(vacantSeats);
      const capacity = ROOM_CAPACITY[roomType] || 0;

      if (!preferredHostel) {
        return res.status(400).json({ message: 'Preferred hostel is required for room partner listing.' });
      }
      if (!roomType) {
        return res.status(400).json({ message: 'Room type is required for room partner listing.' });
      }
      if (!Number.isInteger(total) || total <= 0) {
        return res.status(400).json({ message: 'Total people in room must be a positive integer.' });
      }
      if (!Number.isInteger(vacant) || vacant <= 0) {
        return res.status(400).json({ message: 'Vacant seats must be a positive integer.' });
      }
      if (capacity === 0) {
        return res.status(400).json({ message: 'Invalid room type selected.' });
      }
      if (total > capacity) {
        return res.status(400).json({ message: `Total students cannot exceed ${capacity} for ${roomType}.` });
      }
      if (total + vacant > capacity) {
        return res.status(400).json({ message: `Total + vacant seats cannot exceed ${capacity} for ${roomType}.` });
      }
      if (!contactNumber || !String(contactNumber).trim()) {
        return res.status(400).json({ message: 'Mobile number is required for room partner listing.' });
      }
    }

    const normalizedRoll = rollNumber.toUpperCase();

    // Check if a listing of this type already exists with this roll number
    const existing = await Student.findOne({ rollNumber: normalizedRoll, listingType });
    if (existing) {
      // If it belongs to a different user, reject it
      if (existing.uid !== req.user.uid) {
        return res
          .status(400)
          .json({ message: 'A listing with this roll number already exists.' });
      }

      // If it belongs to the current user, update it
      existing.email = req.user.email;
      existing.name = name;
      existing.rollNumber = normalizedRoll;
      existing.branch = branch;
      existing.year = year;
      existing.currentHostel = listingType === 'roomPartner' ? preferredHostel : currentHostel;
      existing.desiredHostel = listingType === 'roomPartner' ? preferredHostel : desiredHostel;
      existing.contactNumber = contactNumber;
      existing.listingType = listingType;
      existing.preferredHostel = listingType === 'roomPartner' ? preferredHostel : '';
      existing.roomType = listingType === 'roomPartner' ? roomType : '';
      existing.totalPeopleInRoom = listingType === 'roomPartner' ? Number(totalPeopleInRoom) : 0;
      existing.vacantSeats = listingType === 'roomPartner' ? Number(vacantSeats) : 0;
      existing.additionalPreferences = listingType === 'roomPartner' ? (additionalPreferences || '') : '';
      existing.status = 'Looking for Exchange';

      const updated = await existing.save();
      return res.status(200).json(updated);
    }

    const student = new Student({
      uid: req.user.uid,
      email: req.user.email,
      name,
      rollNumber: normalizedRoll,
      branch,
      year,
      currentHostel: listingType === 'roomPartner' ? preferredHostel : currentHostel,
      desiredHostel: listingType === 'roomPartner' ? preferredHostel : desiredHostel,
      contactNumber,
      listingType,
      preferredHostel: listingType === 'roomPartner' ? preferredHostel : '',
      roomType: listingType === 'roomPartner' ? roomType : '',
      totalPeopleInRoom: listingType === 'roomPartner' ? Number(totalPeopleInRoom) : 0,
      vacantSeats: listingType === 'roomPartner' ? Number(vacantSeats) : 0,
      additionalPreferences: listingType === 'roomPartner' ? (additionalPreferences || '') : '',
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
