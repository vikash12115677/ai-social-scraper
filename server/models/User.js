const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  password: { type: String, required: true, minlength: 6, select: false },
  role: {
    type: String,
    enum: ['user', 'admin', 'analyst'],
    default: 'user',
  },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
    language: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true },
    defaultPlatforms: [{ type: String }],
    defaultCategories: [{ type: String }],
  },
  lastLogin: { type: Date },
  refreshToken: { type: String, select: false },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.refreshToken;
      return ret;
    },
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
