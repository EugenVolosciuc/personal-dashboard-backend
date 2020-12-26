const express = require('express');

const Todo = require('../database/models/Todo');
const auth = require('../middleware/authMiddleware');
const paginate = require('../middleware/paginationMiddleware');
const { getTodos, createTodo, modifyTodo, deleteTodo } = require('../controllers/todoController');

const router = express.Router();

router.get('/', auth, paginate(Todo), getTodos);
router.post('/', auth, createTodo);
router.patch('/:id', auth, modifyTodo);
router.delete('/:id', auth, deleteTodo);

module.exports = router;