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

// PHP-compatible users list (supports search/role/limit/offset)
router.get('/users/list', requireAdmin, async (req, res) => {
  try {
    const search = req.query.search ? String(req.query.search) : null;
    const role = req.query.role ? String(req.query.role) : null;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const offset = req.query.offset ? Number(req.query.offset) : 0;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { full_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('full_name email role department year createdAt')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

// PHP-compatible club leaders list
router.get('/clubs/list', requireAdmin, async (req, res) => {
  try {
    const leaders = await ClubLeader.find()
      .populate('user_id', 'full_name email')
      .sort({ club_name: 1 });
    res.json({ success: true, data: leaders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin can create a club leader (creates user + club profile)
router.post('/clubs/create', requireAdmin, async (req, res) => {
  try {
    const { club_name, email, password, full_name, organization_type, bio, university, department, year } = req.body;
    if (!club_name || !email || !password || !full_name) {
      return res.status(400).json({ success: false, message: 'club_name, full_name, email, password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = new User({
      email,
      password_hash: password,
      full_name,
      role: 'club_leader',
      university,
      department,
      year: year !== undefined && year !== null && year !== '' ? Number(year) : undefined,
    });
    await user.save();

    const leader = new ClubLeader({
      user_id: user._id,
      club_name,
      organization_type,
      bio,
      posts_count: 0,
      is_verified: true,
    });
    await leader.save();

    res.json({
      success: true,
      message: 'Club leader created successfully',
      user: { id: user._id, full_name: user.full_name, email: user.email, role: user.role },
      club: leader,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

// PHP-compatible moderation action (approve/reject)
router.post('/moderation/action', requireAdmin, async (req, res) => {
  try {
    const { id, action, reason } = req.body;
    if (!id || !action) {
      return res.status(400).json({ success: false, message: 'Opportunity ID and Action are required' });
    }

    if (action === 'approve') {
      const updated = await Opportunity.findByIdAndUpdate(
        id,
        { status: 'active', moderated_by: req.user.id, moderated_at: new Date(), rejection_reason: null },
        { new: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: 'Opportunity not found' });
      return res.json({ success: true, message: 'Opportunity approved' });
    }

    if (action === 'reject') {
      const updated = await Opportunity.findByIdAndUpdate(
        id,
        { status: 'rejected', moderated_by: req.user.id, moderated_at: new Date(), rejection_reason: reason || 'No specific reason provided.' },
        { new: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: 'Opportunity not found' });
      return res.json({ success: true, message: 'Opportunity rejected' });
    }

    return res.status(400).json({ success: false, message: `Invalid action: ${action}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

// Reports action: dismiss or remove_post (archive)
router.post('/reports/action', requireAdmin, async (req, res) => {
  try {
    const { opportunity_id, action } = req.body;
    if (!opportunity_id || !action) {
      return res.status(400).json({ success: false, message: 'Missing opportunity_id or action' });
    }

    const opp = await Opportunity.findById(opportunity_id);
    if (!opp) return res.status(404).json({ success: false, message: 'Opportunity not found' });

    if (action === 'dismiss') {
      opp.reports = [];
      await opp.save();
      return res.json({ success: true, message: 'Report dismissed. No action taken against the post.' });
    }

    if (action === 'remove_post') {
      opp.status = 'archived';
      opp.reports = [];
      await opp.save();
      return res.json({ success: true, message: 'Opportunity removed and status set to archived.' });
    }

    return res.status(400).json({ success: false, message: `Invalid action type.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

// PHP-compatible blacklist list (includes user + blocked_by)
router.get('/blacklist/list', requireAdmin, async (req, res) => {
  try {
    const list = await IPBlacklist.find()
      .populate('user_id', 'full_name')
      .populate('blocked_by', 'full_name')
      .sort({ blocked_at: -1 });
    res.json({ success: true, data: list });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

router.post('/blacklist/action', requireAdmin, async (req, res) => {
  try {
    const { action } = req.body;

    // Legacy mode (previous backend2): add/remove by ip
    if (action === 'add' || action === 'remove') {
      const { ip_address, reason } = req.body;
      if (action === 'add') {
        await IPBlacklist.findOneAndUpdate(
          { ip_address },
          { reason, blocked_by: req.user.id },
          { upsert: true }
        );
      } else {
        await IPBlacklist.deleteOne({ ip_address });
      }
      return res.json({ success: true });
    }

    // PHP mode: ban/unban user
    if (action === 'ban') {
      const target_user_id = req.body.user_id;
      const reason = req.body.reason || 'Violation of community guidelines';
      if (!target_user_id) return res.status(400).json({ success: false, message: 'Target User ID is required for banning' });

      const user = await User.findById(target_user_id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const ip_to_block = user.last_login_ip || req.ip || '0.0.0.0';
      await IPBlacklist.findOneAndUpdate(
        { ip_address: ip_to_block },
        { ip_address: ip_to_block, user_id: user._id, reason, blocked_by: req.user.id, blocked_at: new Date() },
        { upsert: true, new: true }
      );

      user.role = 'banned';
      await user.save();

      return res.json({ success: true, message: 'User and IP successfully blacklisted' });
    }

    if (action === 'unban') {
      const record_id = req.body.id;
      if (!record_id) return res.status(400).json({ success: false, message: 'Record ID is required for unbanning' });

      const entry = await IPBlacklist.findById(record_id);
      if (entry?.user_id) {
        await User.findByIdAndUpdate(entry.user_id, { role: 'student' });
      }
      await IPBlacklist.findByIdAndDelete(record_id);
      return res.json({ success: true, message: 'Access restored and user role reset.' });
    }

    return res.status(400).json({ success: false, message: `Invalid action: ${action}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;