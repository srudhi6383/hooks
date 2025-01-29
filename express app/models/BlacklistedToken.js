const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' } // Expiry of 7 days
});

module.exports = mongoose.model('BlacklistedToken', blacklistedTokenSchema);
