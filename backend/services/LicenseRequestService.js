const LicenseRequest = require('../models/LicenseRequest');
const License = require('../models/License');
const LicenseRequestFactory = require('../patterns/LicenseRequestFactory');

class LicenseRequestService {
  static async createRequest({ userId, licenseId, reason, requestType }) {
    const request = LicenseRequestFactory.createRequest(
      requestType,
      userId,
      licenseId,
      reason
    );

    return await LicenseRequest.create({
      userId: request.userId,
      licenseId: request.licenseId,
      reason: request.reason,
      requestType: request.requestType,
      priority: request.priority,
      status: 'pending',
    });
  }

  static async getAllRequests() {
    return await LicenseRequest.find()
      .populate('userId', 'name email')
      .populate('licenseId', 'name totalLicenses assignedTo')
      .sort({ createdAt: -1 });
  }

  static async getMyRequests(userId) {
    return await LicenseRequest.find({ userId })
      .populate('licenseId', 'name totalLicenses expiryDate description')
      .sort({ createdAt: -1 });
  }

  static async approveRequest(requestId) {
    const request = await LicenseRequest.findById(requestId);

    if (!request) {
      throw new Error('Request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Request already processed');
    }

    const license = await License.findById(request.licenseId);

    if (!license) {
      throw new Error('License not found');
    }

    if (!Array.isArray(license.assignedTo)) {
      license.assignedTo = [];
    }

    const alreadyAssigned = license.assignedTo.some(
      (id) => String(id) === String(request.userId)
    );

    if (alreadyAssigned) {
      throw new Error('User already has this license');
    }

    if (license.assignedTo.length >= license.totalLicenses) {
      throw new Error('No available licenses left');
    }

    license.assignedTo.push(request.userId);
    await license.save();

    request.status = 'approved';
    return await request.save();
  }

  static async rejectRequest(requestId) {
    const request = await LicenseRequest.findById(requestId);

    if (!request) {
      throw new Error('Request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Request already processed');
    }

    request.status = 'rejected';
    return await request.save();
  }
}

module.exports = LicenseRequestService;