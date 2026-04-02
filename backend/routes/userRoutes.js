const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getUsers, updateUser } = require('../controllers/userController');

const router = express.Router();

router.get('/', protect, adminOnly, getUsers);
router.put('/:id', protect, adminOnly, updateUser);

module.exports = router;