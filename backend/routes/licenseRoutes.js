const express = require('express');
const {
  getLicenses,
  addLicense,
  updateLicense,
  deleteLicense,
} = require('../controllers/licenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getLicenses).post(protect, addLicense);
router.route('/:id').put(protect, updateLicense).delete(protect, deleteLicense);

module.exports = router;