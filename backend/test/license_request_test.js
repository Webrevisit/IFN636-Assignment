const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const License = require('../models/License');
const LicenseRequest = require('../models/LicenseRequest');

const {
  createLicenseRequest,
  getAllLicenseRequests,
  approveLicenseRequest,
  rejectLicenseRequest,
} = require('../controllers/licenseRequestController');

const { expect } = chai;

describe('License Request Controller Function Tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('Submit Normal License Request Test', () => {
    it('should submit a normal license request successfully', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          licenseId: new mongoose.Types.ObjectId(),
          reason: 'Need for project work',
          requestType: 'normal',
        },
      };

      const createdRequest = {
        _id: new mongoose.Types.ObjectId(),
        userId: req.user.id,
        licenseId: req.body.licenseId,
        reason: req.body.reason,
        requestType: 'normal',
        priority: 'normal',
        status: 'pending',
      };

      sinon.stub(LicenseRequest, 'create').resolves(createdRequest);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await createLicenseRequest(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdRequest)).to.be.true;
    });
  });

  describe('Submit Urgent License Request Test', () => {
    it('should submit urgent request with high priority', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          licenseId: new mongoose.Types.ObjectId(),
          reason: 'Urgent project requirement',
          requestType: 'urgent',
        },
      };

      const createdRequest = {
        _id: new mongoose.Types.ObjectId(),
        userId: req.user.id,
        licenseId: req.body.licenseId,
        reason: req.body.reason,
        requestType: 'urgent',
        priority: 'high',
        status: 'pending',
      };

      sinon.stub(LicenseRequest, 'create').resolves(createdRequest);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await createLicenseRequest(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });
  });

  describe('View License Requests as Admin Test', () => {
    it('should return all license requests', async () => {
      const mockRequests = [
        {
          _id: new mongoose.Types.ObjectId(),
          status: 'pending',
        },
      ];

      const sortStub = sinon.stub().resolves(mockRequests);
      const populateStub2 = sinon.stub().returns({ sort: sortStub });
      const populateStub1 = sinon.stub().returns({ populate: populateStub2 });

      sinon.stub(LicenseRequest, 'find').returns({ populate: populateStub1 });

      const req = {};
      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };

      await getAllLicenseRequests(req, res);

      expect(res.json.calledWith(mockRequests)).to.be.true;
    });
  });

  describe('Approve License Request Test', () => {
    it('should approve request and assign license successfully', async () => {
      const userId = new mongoose.Types.ObjectId();
      const licenseId = new mongoose.Types.ObjectId();

      const request = {
        _id: new mongoose.Types.ObjectId(),
        userId,
        licenseId,
        status: 'pending',
        save: sinon.stub().resolvesThis(),
      };

      const license = {
        _id: licenseId,
        totalLicenses: 5,
        assignedTo: [],
        save: sinon.stub().resolvesThis(),
      };

      sinon.stub(LicenseRequest, 'findById').resolves(request);
      sinon.stub(License, 'findById').resolves(license);

      const req = {
        params: { id: request._id.toString() },
      };

      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };

      await approveLicenseRequest(req, res);

      expect(request.status).to.equal('approved');
      expect(license.assignedTo.length).to.equal(1);
      expect(res.json.calledOnce).to.be.true;
    });

    it('should prevent duplicate license assignment', async () => {
      const userId = new mongoose.Types.ObjectId();
      const licenseId = new mongoose.Types.ObjectId();

      const request = {
        _id: new mongoose.Types.ObjectId(),
        userId,
        licenseId,
        status: 'pending',
      };

      const license = {
        _id: licenseId,
        totalLicenses: 5,
        assignedTo: [userId],
      };

      sinon.stub(LicenseRequest, 'findById').resolves(request);
      sinon.stub(License, 'findById').resolves(license);

      const req = {
        params: { id: request._id.toString() },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await approveLicenseRequest(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });

    it('should prevent assignment when no licenses are available', async () => {
      const userId = new mongoose.Types.ObjectId();
      const licenseId = new mongoose.Types.ObjectId();

      const request = {
        _id: new mongoose.Types.ObjectId(),
        userId,
        licenseId,
        status: 'pending',
      };

      const license = {
        _id: licenseId,
        totalLicenses: 1,
        assignedTo: [new mongoose.Types.ObjectId()],
      };

      sinon.stub(LicenseRequest, 'findById').resolves(request);
      sinon.stub(License, 'findById').resolves(license);

      const req = {
        params: { id: request._id.toString() },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await approveLicenseRequest(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });
  });

  describe('Reject License Request Test', () => {
    it('should reject pending request successfully', async () => {
      const request = {
        _id: new mongoose.Types.ObjectId(),
        status: 'pending',
        save: sinon.stub().resolvesThis(),
      };

      sinon.stub(LicenseRequest, 'findById').resolves(request);

      const req = {
        params: { id: request._id.toString() },
      };

      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };

      await rejectLicenseRequest(req, res);

      expect(request.status).to.equal('rejected');
      expect(res.json.calledOnce).to.be.true;
    });
  });
});