const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/User');
const License = require('../models/License');

const { getUsers } = require('../controllers/userController');

const {
  assignLicenseToUser,
  removeAssignedLicenseFromUser,
  getMyLicenses,
} = require('../controllers/licenseController');

const { expect } = chai;

describe('User and License Assignment Function Tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('View All Users Test', () => {
    it('should return all registered normal users without passwords', async () => {
      const mockUsers = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Normal User',
          email: 'user@test.com',
          role: 'user',
        },
      ];

      const findStub = sinon.stub(User, 'find').resolves(mockUsers);

      const req = {};
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };

      await getUsers(req, res);

      expect(findStub.calledWith({ role: 'user' }, '-password')).to.be.true;
      expect(res.json.calledWith(mockUsers)).to.be.true;
    });
  });

  describe('Assign License to User Test', () => {
    it('should assign license to user successfully', async () => {
      const userId = new mongoose.Types.ObjectId();
      const licenseId = new mongoose.Types.ObjectId();

      const license = {
        _id: licenseId,
        totalLicenses: 5,
        assignedTo: [],
        save: sinon.stub().resolvesThis(),
      };

      sinon.stub(License, 'findById').resolves(license);

      const req = {
        params: { id: licenseId.toString() },
        body: { assignedTo: userId },
      };

      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };

      await assignLicenseToUser(req, res);

      expect(license.assignedTo.length).to.equal(1);
      expect(String(license.assignedTo[0])).to.equal(String(userId));
      expect(license.save.calledOnce).to.be.true;
      expect(res.json.calledWith(license)).to.be.true;
    });

    it('should prevent duplicate assignment', async () => {
      const userId = new mongoose.Types.ObjectId();
      const licenseId = new mongoose.Types.ObjectId();

      const license = {
        _id: licenseId,
        totalLicenses: 5,
        assignedTo: [userId],
        save: sinon.stub().resolvesThis(),
      };

      sinon.stub(License, 'findById').resolves(license);

      const req = {
        params: { id: licenseId.toString() },
        body: { assignedTo: userId },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await assignLicenseToUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'User already assigned' })).to.be.true;
    });
  });

  describe('Remove Assigned License Test', () => {
    it('should remove assigned license successfully', async () => {
      const userId = new mongoose.Types.ObjectId();
      const licenseId = new mongoose.Types.ObjectId();

      const license = {
        _id: licenseId,
        assignedTo: [userId],
        save: sinon.stub().resolvesThis(),
      };

      sinon.stub(License, 'findById').resolves(license);

      const req = {
        params: { id: licenseId.toString() },
        body: { userId },
      };

      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };

      await removeAssignedLicenseFromUser(req, res);

      expect(license.assignedTo.length).to.equal(0);
      expect(license.save.calledOnce).to.be.true;
      expect(res.json.calledWith(license)).to.be.true;
    });
  });

  describe('User View Assigned Licenses Test', () => {
    it('should return licenses assigned to logged-in user', async () => {
      const userId = new mongoose.Types.ObjectId();

      const mockLicenses = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'Adobe Photoshop',
          assignedTo: [userId],
        },
      ];

      const findStub = sinon.stub(License, 'find').resolves(mockLicenses);

      const req = {
        user: { id: userId },
      };

      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };

      await getMyLicenses(req, res);

      expect(findStub.calledWith({ assignedTo: req.user.id })).to.be.true;
      expect(res.json.calledWith(mockLicenses)).to.be.true;
    });
  });
});