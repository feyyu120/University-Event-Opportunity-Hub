const express = require('express');
const jwt = require('jsonwebtoken');
const Opportunity = require('../models/Opportunity');
const ClubLeader = require('../models/ClubLeader');
const User = require('../models/User');
const IPBlacklist = require('../models/IPBlacklist');
const router = express.Router();

// Middleware to verify JWT and check club leader role
const verifyClubLeader = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if user is club leader
    const user = await User.findById(decoded.id);
    if (user.role !== 'club_leader') {
      return res.status(403).json({ error: 'Club leader access required' });
    }

    // Get club leader profile
    const clubLeader = await ClubLeader.findOne({ user_id: decoded.id });
    if (!clubLeader) {
      return res.status(403).json({ error: 'Club leader profile not found' });
    }
    req.clubLeader = clubLeader;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware to check IP blacklist for club leaders
const checkClubIP = async (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const blacklistEntry = await IPBlacklist.findOne({ ip_address: ip });
  if (blacklistEntry) {
    return res.status(403).json({ success: false, message: 'Access denied. Security risk identified.', reason: blacklistEntry.reason });
  }
  next();
};

// Get club opportunities list
router.get('/list', verifyClubLeader, async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ club_id: req.clubLeader._id })
      .select('title status description organization_name deadline target_departments min_year rejection_reason created_at')
      .sort({ created_at: -1 });

    res.json({ success: true, data: opportunities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new opportunity
router.post('/post', verifyClubLeader, async (req, res) => {
  try {
    const { title, description, organization_name, deadline, target_departments, min_year } = req.body;

    if (!deadline) {
      return res.status(400).json({ success: false, message: 'Deadline date is required.' });
    }

    const opportunity = new Opportunity({
      title,
      description,
      organization_name,
      deadline,
      target_departments,
      min_year,
      club_id: req.clubLeader._id,
      organizer: req.user.id,
      status: 'pending'
    });

    await opportunity.save();

    // Update post count
    await ClubLeader.findByIdAndUpdate(req.clubLeader._id, { $inc: { posts_count: 1 } });

    res.json({ success: true, message: 'Post submitted and awaiting admin approval.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Club opportunity actions (delete, resubmit)
router.post('/action', verifyClubLeader, async (req, res) => {
  try {
    const { action, opp_id } = req.body;

    const opportunity = await Opportunity.findOne({
      _id: opp_id,
      club_id: req.clubLeader._id
    });

    if (!opportunity) {
      return res.status(403).json({ success: false, message: 'You do not have permission to modify this post.' });
    }

    switch (action) {
      case 'delete':
        await Opportunity.findByIdAndDelete(opp_id);
        await ClubLeader.findByIdAndUpdate(req.clubLeader._id, { $inc: { posts_count: -1 } });
        res.json({ success: true, message: 'Post deleted successfully.' });
        break;

      case 'resubmit':
        await Opportunity.findByIdAndUpdate(opp_id, { status: 'pending', rejection_reason: null });
        res.json({ success: true, message: 'Post resubmitted for approval.' });
        break;

      default:
        res.status(400).json({ success: false, message: 'Invalid action.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get club notifications/stats
router.get('/notification', verifyClubLeader, async (req, res) => {
  try {
    const totalPosts = await Opportunity.countDocuments({ club_id: req.clubLeader._id });
    const pendingPosts = await Opportunity.countDocuments({ club_id: req.clubLeader._id, status: 'pending' });
    const approvedPosts = await Opportunity.countDocuments({ club_id: req.clubLeader._id, status: 'active' });
    const rejectedPosts = await Opportunity.countDocuments({ club_id: req.clubLeader._id, status: 'rejected' });

    res.json({
      success: true,
      stats: {
        total_posts: totalPosts,
        pending_posts: pendingPosts,
        approved_posts: approvedPosts,
        rejected_posts: rejectedPosts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;