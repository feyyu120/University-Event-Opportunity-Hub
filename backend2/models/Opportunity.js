const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  organization_name: String,
  category: String,
  location: String,
  date: Date,
  deadline: Date,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  club_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ClubLeader' },
  requirements: [String],
  contact_info: String,
  images: [String],
  tags: [String],
  target_departments: [String],
  min_year: Number,
  rejection_reason: String,
  moderated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  moderated_at: Date,
  status: { type: String, enum: ['pending', 'active', 'rejected', 'archived', 'expired', 'cancelled'], default: 'active' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    created_at: { type: Date, default: Date.now }
  }],
  reports: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    created_at: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);