const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    totalLicenses: {
      type: Number,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('License', licenseSchema);