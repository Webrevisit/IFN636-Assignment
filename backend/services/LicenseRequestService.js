const LicenseRequest = require('../models/LicenseRequest');
const License = require('../models/License');

class BaseLicenseRequest {
  constructor(userId, licenseId, reason) {
    this.userId = userId;
    this.licenseId = licenseId;
    this.reason = reason;
  }

  getPriority() {
    return 'normal';
  }

  getRequestType() {
    return 'normal';
  }
}

class UrgentLicenseRequest extends BaseLicenseRequest {
  getPriority() {
    return 'high';
  }

  getRequestType() {
    return 'urgent';
  }
}

class LicenseRequestService {
  static async createRequest({ userId, licenseId, reason, requestType }) {
    const request =
      requestType === 'urgent'
        ? new UrgentLicenseRequest(userId, licenseId, reason)
        : new BaseLicenseRequest(userId, licenseId, reason);

    return await LicenseRequest.create({
      userId: request.userId,
      licenseId: request.licenseId,
      reason: request.reason,
      requestType: request.getRequestType(),
      priority: request.getPriority(),
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