const License = require('../models/License');

// GET all Licenses
const getLicenses = async (req, res) => {
  try {
    const licenses = await License.find({ userId: req.user.id });
    res.json(licenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD License
const addLicense = async (req, res) => {
  const { name, totalLicenses, purchaseDate, expiryDate, description } = req.body;

  try {
    const license = await License.create({
      userId: req.user.id,
      name,
      totalLicenses,
      purchaseDate,
      expiryDate,
      description,
    });

    res.status(201).json(license);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE License
const updateLicense = async (req, res) => {
  const { name, totalLicenses, purchaseDate, expiryDate, description } = req.body;

  try {
    const license = await License.findById(req.params.id);

    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    license.name = name || license.name;
    license.totalLicenses = totalLicenses ?? license.totalLicenses;
    license.purchaseDate = purchaseDate || license.purchaseDate;
    license.expiryDate = expiryDate || license.expiryDate;
    license.description = description || license.description;

    const updatedLicense = await license.save();
    res.json(updatedLicense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE License
const deleteLicense = async (req, res) => {
  try {
    const license = await License.findById(req.params.id);

    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    await license.deleteOne();
    res.json({ message: 'License deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ASSIGN License to User
const assignLicenseToUser = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const license = await License.findById(req.params.id);

    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    // Prevent duplicate assignment
    if (license.assignedTo.includes(assignedTo)) {
      return res.status(400).json({ message: 'User already assigned' });
    }

    // Check license limit
    if (license.assignedTo.length >= license.totalLicenses) {
      return res.status(400).json({ message: 'No licenses available' });
    }

    license.assignedTo.push(assignedTo);

    const updatedLicense = await license.save();
    res.json(updatedLicense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const removeAssignedLicenseFromUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const license = await License.findById(req.params.id);

    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    license.assignedTo = license.assignedTo.filter(
      (assignedUserId) => String(assignedUserId) !== String(userId)
    );

    const updatedLicense = await license.save();
    res.json(updatedLicense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyLicenses = async (req, res) => {
  try {
    const licenses = await License.find({
      assignedTo: req.user.id,
    });

    res.json(licenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLicenses,
  addLicense,
  updateLicense,
  deleteLicense,
  assignLicenseToUser,
  removeAssignedLicenseFromUser,
  getMyLicenses,
};