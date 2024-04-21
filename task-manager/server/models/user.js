const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'user'], required: true }
});

userSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

module.exports = mongoose.model('User', userSchema);
