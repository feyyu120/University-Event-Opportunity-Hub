const mongoose = require('mongoose');

const clubLeaderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  club_name: { type: String, required: true },
  organization_type: String,
  bio: String,
  posts_count: { type: Number, default: 0 },
  is_verified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ClubLeader', clubLeaderSchema);