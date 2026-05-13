const express = require('express');

const {
  createLicenseRequest,
  getAllLicenseRequests,
  getMyLicenseRequests,
  approveLicenseRequest,
  rejectLicenseRequest,
} = require('../controllers/licenseRequestController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createLicenseRequest);
router.get('/my-requests', protect, getMyLicenseRequests);
router.get('/', protect, adminOnly, getAllLicenseRequests);
router.put('/:id/approve', protect, adminOnly, approveLicenseRequest);
router.put('/:id/reject', protect, adminOnly, rejectLicenseRequest);

module.exports = router;