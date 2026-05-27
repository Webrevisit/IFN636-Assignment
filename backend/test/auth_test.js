const chai = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const {
  registerUser,
  loginUser,
} = require('../controllers/authController');

const { expect } = chai;

describe('Authentication Controller Function Tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('Register User Function Test', () => {
    it('should register a new user successfully', async () => {
      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      };

      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(bcrypt, 'hash').resolves('hashedPassword');

      const createdUser = {
        _id: 'user123',
        name: req.body.name,
        email: req.body.email,
        role: 'user',
      };

      sinon.stub(User, 'create').resolves(createdUser);
      sinon.stub(jwt, 'sign').returns('mockToken');

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await registerUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should return error if email already exists', async () => {
      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      };

      sinon.stub(User, 'findOne').resolves({ email: req.body.email });

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await registerUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });
  });

  describe('Login User Function Test', () => {
    it('should login user successfully with valid credentials', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };

      const user = {
        _id: 'user123',
        name: 'Test User',
        email: req.body.email,
        password: 'hashedPassword',
        role: 'user',
      };

      sinon.stub(User, 'findOne').resolves(user);
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('mockToken');

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await loginUser(req, res);

      expect(res.json.calledOnce).to.be.true;
    });

    it('should reject invalid login credentials', async () => {
      const req = {
        body: {
          email: 'wrong@example.com',
          password: 'wrongpassword',
        },
      };

      sinon.stub(User, 'findOne').resolves(null);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await loginUser(req, res);

      expect(res.status.calledWith(401)).to.be.true;
    });
  });
});