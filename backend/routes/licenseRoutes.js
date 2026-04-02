const express = require('express');
const {
  getLicenses,
  addLicense,
  updateLicense,
  deleteLicense,
  assignLicenseToUser,
  removeAssignedLicenseFromUser,
  getMyLicenses,
} = require('../controllers/licenseController');
const { protect,adminOnly } = require('../middleware/authMiddleware');
adminOnly

const router = express.Router();
router.get('/my-licenses', protect, getMyLicenses);
router.route('/').get(protect, getLicenses).post(protect, addLicense);
router.route('/:id').put(protect, updateLicense).delete(protect, deleteLicense);
router.put('/:id/assign', protect, adminOnly, assignLicenseToUser);
router.put('/:id/remove-assignment', protect, adminOnly, removeAssignedLicenseFromUser);


module.exports = router;