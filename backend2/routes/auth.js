const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ClubLeader = require('../models/ClubLeader');
const IPBlacklist = require('../models/IPBlacklist');
const router = express.Router();

// Middleware to check IP blacklist
const checkIP = async (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const blacklistEntry = await IPBlacklist.findOne({ ip_address: ip });
  if (blacklistEntry) {
    return res.status(403).json({ success: false, message: 'Access denied. Security risk identified.', reason: blacklistEntry.reason });
  }
  next();
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, role = 'student' } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    const user = new User({ email, password_hash: password, full_name, role });
    await user.save();
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user._id, full_name: user.full_name, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check authorization
router.post('/autorize', async (req, res) => {
  try {
    const { user_id, role } = req.body;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ authorized: false, error: 'User not found' });
    }
    if (user.role === role) {
      res.json({ authorized: true, message: 'User has the required permissions', current_role: user.role });
    } else {
      res.status(403).json({ authorized: false, error: `Permission denied. Required: ${role}, Found: ${user.role}` });
    }
  } catch (error) {
    res.status(500).json({ error: 'Database error: ' + error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Admin login
router.post('/admin_login', checkIP, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (user.role === 'admin') {
      res.json({ id: user._id, success: true, message: 'Welcome, Admin', redirect: 'admin_dashboard.php' });
    } else {
      // Block non-admin IP
      await IPBlacklist.findOneAndUpdate(
        { ip_address: req.ip },
        { reason: 'attempted to access restricted web portal', user_id: user._id },
        { upsert: true }
      );
      res.status(403).json({ success: false, message: 'Access restricted to staff only. IP Logged.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Club member login
router.post('/club_member_login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('university_id');
    if (!user || user.role !== 'club_leader' || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const clubLeader = await ClubLeader.findOne({ user_id: user._id });
    if (!clubLeader) {
      return res.status(403).json({ success: false, message: 'Access denied. Unknown club leader' });
    }
    res.json({
      message: 'Login successful',
      club: {
        id: clubLeader._id,
        full_name: clubLeader.club_name,
        email: clubLeader.organization_type,
        role: clubLeader.bio,
        university: clubLeader.posts_count,
        department: clubLeader.is_verified
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error: ' + error.message });
  }
});

module.exports = router;