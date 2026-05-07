const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  full_name: { type: String, required: true },
  role: { type: String, enum: ['student', 'club_leader', 'admin', 'banned'], default: 'student' },
  department: String,
  year: Number,
  university: String,
  university_id: mongoose.Schema.Types.ObjectId,
  bio: String,
  profile_image: String,
  last_active_at: Date,
  last_login_ip: String,
  interests: [String],
  saved_opportunities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' }],
  applications: [{
    opportunity_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' },
    applied_at: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) return next();
  this.password_hash = await bcrypt.hash(this.password_hash, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = mongoose.model('User', userSchema);