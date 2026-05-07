const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const ClubLeader = require('../models/ClubLeader');
const IPBlacklist = require('../models/IPBlacklist');
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

// Apply to all routes
router.use(verifyToken);

// Middleware to check admin role
const requireAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get users list
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password_hash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get clubs list
router.get('/clubs', requireAdmin, async (req, res) => {
  try {
    const clubs = await ClubLeader.find().populate('user_id', 'full_name email');
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending moderations
router.get('/moderation/pending', requireAdmin, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ status: 'pending' });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get reports
router.get('/reports', requireAdmin, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ 'reports.0': { $exists: true } });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blacklist management
router.get('/blacklist', requireAdmin, async (req, res) => {
  try {
    const blacklist = await IPBlacklist.find();
    res.json(blacklist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/blacklist/action', requireAdmin, async (req, res) => {
  try {
    const { action, ip_address, reason } = req.body;
    if (action === 'add') {
      await IPBlacklist.findOneAndUpdate(
        { ip_address },
        { reason },
        { upsert: true }
      );
    } else if (action === 'remove') {
      await IPBlacklist.deleteOne({ ip_address });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;