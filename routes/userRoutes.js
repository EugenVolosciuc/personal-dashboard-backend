const express = require('express');

const { createUser, modifyUser, loginUser, logoutUser, getMe } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', auth, getMe);
router.post('/', createUser);
router.patch('/:id', auth, modifyUser);
router.post('/login', loginUser);
router.post('/logout', auth, logoutUser);

module.exports = router;