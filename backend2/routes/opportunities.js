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

// Compatibility: POST /opportunities/feed { page, limit, search, category }
router.post('/feed', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.body ?? {};
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

// Compatibility: GET /opportunities/detail?id=<id>
router.get('/detail', async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ success: false, error: 'id is required' });
    const opportunity = await Opportunity.findById(id)
      .populate('organizer', 'full_name')
      .populate('comments.user', 'full_name');
    if (!opportunity) return res.status(404).json({ success: false, error: 'Opportunity not found' });
    res.json({ success: true, data: opportunity, comments: opportunity.comments ?? [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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

// Compatibility: POST /opportunities/like { opportunity_id }
router.post('/like', verifyToken, async (req, res) => {
  try {
    const { opportunity_id } = req.body;
    if (!opportunity_id) return res.status(400).json({ error: 'opportunity_id is required' });

    const opportunity = await Opportunity.findById(opportunity_id);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

    const userIndex = opportunity.likes.indexOf(req.user.id);
    let liked;
    if (userIndex > -1) {
      opportunity.likes.splice(userIndex, 1);
      liked = false;
    } else {
      opportunity.likes.push(req.user.id);
      liked = true;
    }
    await opportunity.save();
    res.json({ liked, like_count: opportunity.likes.length });
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

// Compatibility: POST /opportunities/comment { opportunity_id, content }
router.post('/comment', verifyToken, async (req, res) => {
  try {
    const { opportunity_id, content } = req.body;
    if (!opportunity_id) return res.status(400).json({ error: 'opportunity_id is required' });
    if (!content) return res.status(400).json({ error: 'content is required' });

    const opportunity = await Opportunity.findById(opportunity_id);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

    opportunity.comments.push({ user: req.user.id, text: content });
    await opportunity.save();
    const newComment = opportunity.comments[opportunity.comments.length - 1];
    res.json({ success: true, data: newComment });
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

// Compatibility: POST /opportunities/report { opportunity_id, reason }
router.post('/report', verifyToken, async (req, res) => {
  try {
    const { opportunity_id, reason } = req.body;
    if (!opportunity_id) return res.status(400).json({ error: 'opportunity_id is required' });
    if (!reason) return res.status(400).json({ error: 'reason is required' });

    const opportunity = await Opportunity.findById(opportunity_id);
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

    opportunity.reports.push({ user: req.user.id, reason });
    await opportunity.save();
    res.json({ success: true, message: 'Report submitted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;