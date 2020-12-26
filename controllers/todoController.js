const Todo = require('../database/models/Todo');
const { ErrorHandler } = require('../utils/errorHandler');
const checkAndUpdateProperties = require('../utils/updatablePropertyChecker');

// @desc    Get todos
// @route   GET /todos
// @access  Private
module.exports.getTodos = async (req, res, next) => {
  try {
    if (!res.paginatedResults.todos) throw new ErrorHandler(404, 'No todos found');

    res.json(res.paginatedResults);
  } catch (error) {
    next(error);
  }
}

// @desc    Create todo
// @route   GET /todos
// @access  Private
module.exports.createTodo = async (req, res, next) => {
  try {
    const todo = await Todo.create({...req.body, user: req.user._id });

    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
}

// @desc    Modify todo
// @route   PATCH /todos/:id
// @access  Private
module.exports.modifyTodo = async (req, res, next) => {
  const possibleUpdates = Object.keys(Todo.schema.obj);
  const dataToUpdate = req.body;
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);

    if (!todo) throw new ErrorHandler(404, 'Todo not found');

    checkAndUpdateProperties(todo, dataToUpdate, possibleUpdates);

    await todo.save();

    res.json(todo);
  } catch (error) {
    next(error);
  }
}

module.exports.deleteTodo = async (req, res, next) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) throw new ErrorHandler(404, 'Todo not found');

    res.json(todo);
  } catch (error) {
    next(error);
  }
}