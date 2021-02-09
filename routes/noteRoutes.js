const express = require('express');

const Note = require('../database/models/Note');
const auth = require('../middleware/authMiddleware');
const paginate = require('../middleware/paginationMiddleware');
const { getNotes, createNote, modifyNote, deleteNote } = require('../controllers/noteController');

const router = express.Router();

router.get('/', auth, paginate(Note, null, true), getNotes);
router.post('/', auth, createNote);
router.patch('/:id', auth, modifyNote);
router.delete('/:id', auth, deleteNote);

module.exports = router;