class NormalLicenseRequest {
  constructor(userId, licenseId, reason) {
    this.userId = userId;
    this.licenseId = licenseId;
    this.reason = reason;
    this.requestType = 'normal';
    this.priority = 'normal';
  }
}

class UrgentLicenseRequest {
  constructor(userId, licenseId, reason) {
    this.userId = userId;
    this.licenseId = licenseId;
    this.reason = reason;
    this.requestType = 'urgent';
    this.priority = 'high';
  }
}

class LicenseRequestFactory {
  static createRequest(type, userId, licenseId, reason) {
    if (type === 'urgent') {
      return new UrgentLicenseRequest(
        userId,
        licenseId,
        reason
      );
    }

    return new NormalLicenseRequest(
      userId,
      licenseId,
      reason
    );
  }
}

module.exports = LicenseRequestFactory;