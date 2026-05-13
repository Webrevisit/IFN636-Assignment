const LicenseRequestService = require('../services/LicenseRequestService');

const createLicenseRequest = async (req, res) => {
  try {
    const { licenseId, reason, requestType } = req.body;

    if (!licenseId || !reason) {
      return res.status(400).json({ message: 'License and reason are required' });
    }

    const request = await LicenseRequestService.createRequest({
      userId: req.user.id,
      licenseId,
      reason,
      requestType,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllLicenseRequests = async (req, res) => {
  try {
    const requests = await LicenseRequestService.getAllRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyLicenseRequests = async (req, res) => {
  try {
    const requests = await LicenseRequestService.getMyRequests(req.user.id);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveLicenseRequest = async (req, res) => {
  try {
    const request = await LicenseRequestService.approveRequest(req.params.id);
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const rejectLicenseRequest = async (req, res) => {
  try {
    const request = await LicenseRequestService.rejectRequest(req.params.id);
    res.json(request);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createLicenseRequest,
  getAllLicenseRequests,
  getMyLicenseRequests,
  approveLicenseRequest,
  rejectLicenseRequest,
};