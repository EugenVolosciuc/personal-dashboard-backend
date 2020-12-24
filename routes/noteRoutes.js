const express = require('express');

const Note = require('../database/models/Note');
const auth = require('../middleware/authMiddleware');
const paginate = require('../middleware/paginationMiddleware');
const { getNotes, createNote, modifyNote } = require('../controllers/noteController');

const router = express.Router();

router.get('/', auth, paginate(Note), getNotes);
router.post('/', auth, createNote);
router.patch('/:id', auth, modifyNote);

module.exports = router;