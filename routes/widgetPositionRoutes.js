const express = require('express');

const { getWidgetPositions, addWidgetPosition, updateWidgetPosition, deleteWidgetPosition } = require('../controllers/widgetPositionController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, getWidgetPositions);
router.post('/', auth, addWidgetPosition);
router.patch('/:id', auth, updateWidgetPosition);
router.delete('/:id', auth, deleteWidgetPosition);

module.exports = router;