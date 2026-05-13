const mongoose = require('mongoose');

const licenseRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    licenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'License',
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    requestType: {
      type: String,
      enum: ['normal', 'urgent'],
      default: 'normal',
    },
    priority: {
      type: String,
      enum: ['normal', 'high'],
      default: 'normal',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LicenseRequest', licenseRequestSchema);