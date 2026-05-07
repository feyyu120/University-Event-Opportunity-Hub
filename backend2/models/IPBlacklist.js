const mongoose = require('mongoose');

const ipBlacklistSchema = new mongoose.Schema({
  ip_address: { type: String, required: true, unique: true },
  reason: String,
  user_id: mongoose.Schema.Types.ObjectId,
  blocked_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IPBlacklist', ipBlacklistSchema);