const express = require('express');
const University = require('../models/University');
const router = express.Router();

// Initialize social data
router.get('/social', async (req, res) => {
  try {
    // This could be used to seed initial data
    const universities = await University.find();
    res.json({ success: true, universities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;