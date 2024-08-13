// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  savedAdventures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Adventure',
    },
  ],
  bookingHistory: [
    {
      adventure: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Adventure',
      },
      date: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  roles: {
    type: [String],
    enum: ['user', 'provider', 'admin'],
    default: ['user'],
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
