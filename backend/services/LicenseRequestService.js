const LicenseRequest = require('../models/LicenseRequest');
const LicenseRequestFactory = require('../patterns/LicenseRequestFactory');
const LicenseFacade = require('../patterns/LicenseFacade');

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

    await LicenseFacade.assignLicenseToUser(
      request.licenseId,
      request.userId
    );

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