const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { optionalAuth } = require('../middleware/auth');

// GET /api/matches — compute perfect matches on-the-fly and filter for the logged-in user
router.get('/', optionalAuth, async (req, res) => {
  try {
    // Students in Ramanujan who want Ambedkar
    const groupA = await Student.find({
      currentHostel: 'Ramanujan Bhawan',
      desiredHostel: 'Ambedkar Bhawan',
      status: 'Looking for Exchange',
    }).sort({ createdAt: 1 });

    // Students in Ambedkar who want Ramanujan
    const groupB = await Student.find({
      currentHostel: 'Ambedkar Bhawan',
      desiredHostel: 'Ramanujan Bhawan',
      status: 'Looking for Exchange',
    }).sort({ createdAt: 1 });

    // Pair them up
    const matchCount = Math.min(groupA.length, groupB.length);
    let allMatches = [];
    for (let i = 0; i < matchCount; i++) {
      allMatches.push({ studentA: groupA[i], studentB: groupB[i] });
    }

    // Server-side filter: Only return the match that belongs to the current logged-in user
    let filteredMatches = [];
    if (req.user) {
      const myMatch = allMatches.find(
        (m) => m.studentA.uid === req.user.uid || m.studentB.uid === req.user.uid
      );
      if (myMatch) {
        filteredMatches = [myMatch];
      }
    }

    res.json({
      matches: filteredMatches,
      unmatchedRamanujan: groupA.slice(matchCount),
      unmatchedAmbedkar: groupB.slice(matchCount),
      totalMatches: matchCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
