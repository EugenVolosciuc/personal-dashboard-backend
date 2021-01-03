const express = require('express');

const { getCoordinates, getWeather } = require('../controllers/weatherController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, getWeather);
router.get('/coordinates', auth, getCoordinates);

module.exports = router;