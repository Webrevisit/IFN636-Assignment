const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const License = require('../models/License');
const {
  getLicenses,
  addLicense,
  updateLicense,
  deleteLicense,
} = require('../controllers/licenseController');

const { expect } = chai;

describe('License Controller Function Tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  // =========================
  // ADD LICENSE TESTS
  // =========================
  describe('AddLicense Function Test', () => {
    it('should create a new license successfully', async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          name: 'Adobe Photoshop',
          totalLicenses: 25,
          purchaseDate: '2026-03-29',
          expiryDate: '2030-03-29',
          description: 'Design software license',
        },
      };

      const createdLicense = {
        _id: new mongoose.Types.ObjectId(),
        ...req.body,
        userId: req.user.id,
      };

      const createStub = sinon.stub(License, 'create').resolves(createdLicense);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await addLicense(req, res);

      expect(createStub.calledOnceWith({
        userId: req.user.id,
        name: req.body.name,
        totalLicenses: req.body.totalLicenses,
        purchaseDate: req.body.purchaseDate,
        expiryDate: req.body.expiryDate,
        description: req.body.description,
      })).to.be.true;

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdLicense)).to.be.true;
    });

    it('should return 500 if an error occurs', async () => {
      sinon.stub(License, 'create').throws(new Error('DB Error'));

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          name: 'Adobe Photoshop',
          totalLicenses: 25,
          purchaseDate: '2026-03-29',
          expiryDate: '2030-03-29',
          description: 'Design software license',
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await addLicense(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  // =========================
  // GET LICENSES TESTS
  // =========================
  describe('GetLicenses Function Test', () => {
    it('should return all licenses for the given user', async () => {
      const userId = new mongoose.Types.ObjectId();

      const mockLicenses = [
        {
          _id: new mongoose.Types.ObjectId(),
          userId,
          name: 'Adobe Photoshop',
          totalLicenses: 20,
          purchaseDate: '2026-03-29',
          expiryDate: '2030-03-29',
          description: 'Design software',
        },
        {
          _id: new mongoose.Types.ObjectId(),
          userId,
          name: 'MS Office',
          totalLicenses: 50,
          purchaseDate: '2026-03-29',
          expiryDate: '2031-03-29',
          description: 'Office productivity',
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

      await getLicenses(req, res);

      expect(findStub.calledOnceWith({ userId: req.user.id })).to.be.true;
      expect(res.json.calledWith(mockLicenses)).to.be.true;
    });

    it('should return 500 if an error occurs while fetching licenses', async () => {
      sinon.stub(License, 'find').throws(new Error('DB Error'));

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
      };

      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };

      await getLicenses(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  // =========================
  // UPDATE LICENSE TESTS
  // =========================
  describe('UpdateLicense Function Test', () => {
    it('should update a license successfully', async () => {
      const existingLicense = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Old Name',
        totalLicenses: 10,
        purchaseDate: '2026-03-29',
        expiryDate: '2030-03-29',
        description: 'Old description',
        save: sinon.stub().resolvesThis(),
      };

      const findByIdStub = sinon.stub(License, 'findById').resolves(existingLicense);

      const req = {
        params: { id: existingLicense._id.toString() },
        body: {
          name: 'New Name',
          totalLicenses: 30,
          purchaseDate: '2026-04-01',
          expiryDate: '2032-04-01',
          description: 'Updated description',
        },
      };

      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };

      await updateLicense(req, res);

      expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
      expect(existingLicense.name).to.equal('New Name');
      expect(existingLicense.totalLicenses).to.equal(30);
      expect(existingLicense.purchaseDate).to.equal('2026-04-01');
      expect(existingLicense.expiryDate).to.equal('2032-04-01');
      expect(existingLicense.description).to.equal('Updated description');
      expect(existingLicense.save.calledOnce).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should return 404 if license is not found', async () => {
      sinon.stub(License, 'findById').resolves(null);

      const req = {
        params: { id: new mongoose.Types.ObjectId().toString() },
        body: {
          name: 'New Name',
          totalLicenses: 30,
          purchaseDate: '2026-04-01',
          expiryDate: '2032-04-01',
          description: 'Updated description',
        },
      };

      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };

      await updateLicense(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'License not found' })).to.be.true;
    });

    it('should return 500 if an error occurs while updating', async () => {
      sinon.stub(License, 'findById').throws(new Error('DB Error'));

      const req = {
        params: { id: new mongoose.Types.ObjectId().toString() },
        body: {
          name: 'New Name',
          totalLicenses: 30,
          purchaseDate: '2026-04-01',
          expiryDate: '2032-04-01',
          description: 'Updated description',
        },
      };

      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };

      await updateLicense(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });

  // =========================
  // DELETE LICENSE TESTS
  // =========================
  describe('DeleteLicense Function Test', () => {
    it('should delete a license successfully', async () => {
      const existingLicense = {
        _id: new mongoose.Types.ObjectId(),
        deleteOne: sinon.stub().resolves(),
      };

      const findByIdStub = sinon.stub(License, 'findById').resolves(existingLicense);

      const req = {
        params: { id: existingLicense._id.toString() },
      };

      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };

      await deleteLicense(req, res);

      expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
      expect(existingLicense.deleteOne.calledOnce).to.be.true;
      expect(res.json.calledWith({ message: 'License deleted' })).to.be.true;
    });

    it('should return 404 if license is not found', async () => {
      sinon.stub(License, 'findById').resolves(null);

      const req = {
        params: { id: new mongoose.Types.ObjectId().toString() },
      };

      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };

      await deleteLicense(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'License not found' })).to.be.true;
    });

    it('should return 500 if an error occurs while deleting', async () => {
      sinon.stub(License, 'findById').throws(new Error('DB Error'));

      const req = {
        params: { id: new mongoose.Types.ObjectId().toString() },
      };

      const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis(),
      };

      await deleteLicense(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
  });
});