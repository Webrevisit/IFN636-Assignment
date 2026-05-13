const License = require('../models/License');

class LicenseFacade {
  static async assignLicenseToUser(licenseId, userId) {
    const license = await License.findById(licenseId);

    if (!license) {
      throw new Error('License not found');
    }

    if (!Array.isArray(license.assignedTo)) {
      license.assignedTo = [];
    }

    const alreadyAssigned = license.assignedTo.some(
      (id) => String(id) === String(userId)
    );

    if (alreadyAssigned) {
      throw new Error('User already has this license');
    }

    if (license.assignedTo.length >= license.totalLicenses) {
      throw new Error('No available licenses left');
    }

    license.assignedTo.push(userId);

    await license.save();

    return license;
  }
}

module.exports = LicenseFacade;