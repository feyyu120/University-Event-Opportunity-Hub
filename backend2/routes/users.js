const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
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

// Update user profile
router.put('/me', verifyToken, async (req, res) => {
  try {
    const allowed = ['full_name', 'department', 'year', 'bio', 'interests'];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        department: user.department,
        year: user.year,
        university: user.university,
        bio: user.bio,
        profile_image: user.profile_image,
        interests: user.interests,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get saved opportunities
router.get('/saved', verifyToken, async (req, res) => {
  try {
    // Accept legacy query param (mobile used to send user_id)
    // We ignore it and use the JWT identity.
    const user = await User.findById(req.user.id).populate('saved_opportunities');
    res.json(user.saved_opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle save/unsave opportunity
router.post('/saved', verifyToken, async (req, res) => {
  try {
    // Accept legacy body { user_id, opportunity_id }
    const { opportunity_id } = req.body;
    if (!opportunity_id) return res.status(400).json({ error: 'opportunity_id is required' });

    const oppExists = await Opportunity.exists({ _id: opportunity_id });
    if (!oppExists) return res.status(404).json({ error: 'Opportunity not found' });

    const user = await User.findById(req.user.id);
    const idx = user.saved_opportunities.findIndex((id) => id.toString() === opportunity_id);
    let saved;
    if (idx >= 0) {
      user.saved_opportunities.splice(idx, 1);
      saved = false;
    } else {
      user.saved_opportunities.push(opportunity_id);
      saved = true;
    }
    await user.save();
    res.json({ success: true, saved });
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

// Add/update application
router.post('/applications', verifyToken, async (req, res) => {
  try {
    // Accept legacy body { user_id, opportunity_id, notes }
    const { opportunity_id, notes } = req.body;
    if (!opportunity_id) return res.status(400).json({ error: 'opportunity_id is required' });

    const oppExists = await Opportunity.exists({ _id: opportunity_id });
    if (!oppExists) return res.status(404).json({ error: 'Opportunity not found' });

    const user = await User.findById(req.user.id);
    const existing = user.applications.find((a) => a.opportunity_id?.toString() === opportunity_id);
    if (existing) {
      existing.status = existing.status || 'applied';
      if (notes) existing.notes = notes;
      existing.applied_at = existing.applied_at || new Date();
    } else {
      user.applications.push({
        opportunity_id,
        status: 'applied',
        applied_at: new Date(),
        notes: notes || '',
      });
    }
    await user.save();
    res.json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;