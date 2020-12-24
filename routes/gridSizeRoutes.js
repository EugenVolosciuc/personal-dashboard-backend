const express = require('express');

const { getGridSize } = require('../controllers/gridSizeController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, getGridSize);

module.exports = router;