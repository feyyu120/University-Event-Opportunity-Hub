const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('university_id');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      id: user._id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      department: user.department,
      year: user.year,
      university: user.university,
      bio: user.bio,
      profile_image: user.profile_image
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get saved opportunities
router.get('/saved', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('saved_opportunities');
    res.json(user.saved_opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update interests
router.post('/interests', verifyToken, async (req, res) => {
  try {
    const { interests } = req.body;
    await User.findByIdAndUpdate(req.user.id, { interests });
    res.json({ success: true, message: 'Interests updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get applications
router.get('/applications', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('applications.opportunity_id');
    res.json(user.applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;