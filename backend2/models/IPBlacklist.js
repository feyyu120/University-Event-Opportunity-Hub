const mongoose = require('mongoose');

const ipBlacklistSchema = new mongoose.Schema({
  ip_address: { type: String, required: true, unique: true },
  reason: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  blocked_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  blocked_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IPBlacklist', ipBlacklistSchema);