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
      listingType: 'exchange',
    }).sort({ createdAt: 1 });

    // Students in Ambedkar who want Ramanujan
    const groupB = await Student.find({
      currentHostel: 'Ambedkar Bhawan',
      desiredHostel: 'Ramanujan Bhawan',
      status: 'Looking for Exchange',
      listingType: 'exchange',
    }).sort({ createdAt: 1 });

    // Students in Kasturba who want Kalpana
    const groupC = await Student.find({
      currentHostel: 'Kasturba Bhawan',
      desiredHostel: 'Kalpana Bhawan',
      status: 'Looking for Exchange',
      listingType: 'exchange',
    }).sort({ createdAt: 1 });

    // Students in Kalpana who want Kasturba
    const groupD = await Student.find({
      currentHostel: 'Kalpana Bhawan',
      desiredHostel: 'Kasturba Bhawan',
      status: 'Looking for Exchange',
      listingType: 'exchange',
    }).sort({ createdAt: 1 });

    // Pair boys
    const boysMatchCount = Math.min(groupA.length, groupB.length);
    let allMatches = [];
    for (let i = 0; i < boysMatchCount; i++) {
      allMatches.push({ studentA: groupA[i], studentB: groupB[i] });
    }

    // Pair girls
    const girlsMatchCount = Math.min(groupC.length, groupD.length);
    for (let i = 0; i < girlsMatchCount; i++) {
      allMatches.push({ studentA: groupC[i], studentB: groupD[i] });
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
      unmatchedRamanujan: groupA.slice(boysMatchCount),
      unmatchedAmbedkar: groupB.slice(boysMatchCount),
      unmatchedKasturba: groupC.slice(girlsMatchCount),
      unmatchedKalpana: groupD.slice(girlsMatchCount),
      totalMatches: boysMatchCount + girlsMatchCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
