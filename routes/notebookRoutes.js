const express = require('express');

const { getNotebooks, createNotebook, modifyNotebook, deleteNotebook } = require('../controllers/notebookController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, getNotebooks);
router.post('/', auth, createNotebook);
router.patch('/:id', auth, modifyNotebook);
router.delete('/:id', auth, deleteNotebook);

module.exports = router;