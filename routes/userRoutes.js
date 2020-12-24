const express = require('express');

const { createUser, loginUser, logoutUser, getMe } = require('../controllers/userController');

const router = express.Router();

router.get('/me', getMe);
router.post('/', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;