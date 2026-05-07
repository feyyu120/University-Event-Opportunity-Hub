const express = require('express');
const jwt = require('jsonwebtoken');
const Opportunity = require('../models/Opportunity');
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

// Get opportunities feed
router.get('/feed', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    let query = { status: 'active' };
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const opportunities = await Opportunity.find(query)
      .populate('organizer', 'full_name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get opportunity details
router.get('/detail/:id', async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('organizer', 'full_name')
      .populate('comments.user', 'full_name');
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like opportunity
router.post('/like/:id', verifyToken, async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

    const userIndex = opportunity.likes.indexOf(req.user.id);
    if (userIndex > -1) {
      opportunity.likes.splice(userIndex, 1);
    } else {
      opportunity.likes.push(req.user.id);
    }
    await opportunity.save();
    res.json({ success: true, likes: opportunity.likes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment
router.post('/comment/:id', verifyToken, async (req, res) => {
  try {
    const { text } = req.body;
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

    opportunity.comments.push({ user: req.user.id, text });
    await opportunity.save();
    res.json({ success: true, message: 'Comment added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Report opportunity
router.post('/report/:id', verifyToken, async (req, res) => {
  try {
    const { reason } = req.body;
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

    opportunity.reports.push({ user: req.user.id, reason });
    await opportunity.save();
    res.json({ success: true, message: 'Report submitted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;