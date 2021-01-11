const Notebook = require('../database/models/Notebook');
const Note = require('../database/models/Note');
const { ErrorHandler } = require('../utils/errorHandler');
const checkAndUpdateProperties = require('../utils/updatablePropertyChecker');

// @desc    Get notebooks
// @route   GET /notebooks
// @access  Private
module.exports.getNotebooks = async (req, res, next) => {
  try {
    const notebooks = await Notebook.find({ user: req.user._id });

    res.json(notebooks);
  } catch (error) {
    next(error);
  }
}

// @desc    Create notebook
// @route   POST /notebooks
// @access  Private
module.exports.createNotebook = async (req, res, next) => {
  try {
    const notebook = await Notebook.create({ ...req.body, user: req.user._id });

    res.status(201).json(notebook);
  } catch (error) {
    next(error);
  }
}

// @desc    Modify notebook
// @route   PATCH /notebooks/:id
// @access  Private
module.exports.modifyNotebook = async (req, res, next) => {
  const possibleUpdates = Object.keys(Notebook.schema.obj);
  const dataToUpdate = req.body;
  const { id } = req.params;

  try {
    const notebook = await Notebook.findById(id);

    if (!notebook) throw new ErrorHandler(404, 'Notebook not found');

    checkAndUpdateProperties(notebook, dataToUpdate, possibleUpdates);

    await notebook.save();

    res.json(notebook);
  } catch (error) {
    next(error);
  }
}

// @desc    Delete notebook
// @route   DELETE /notebooks/:id
// @access  Private
module.exports.deleteNotebook = async (req, res, next) => {
  const { id } = req.params;
  const { move } = req.query;

  try {
    const deletedNotebook = await Notebook.findByIdAndDelete(id);

    if (!deletedNotebook) throw new ErrorHandler(404, 'Notebook not found');

    if (deletedNotebook.title === 'General') throw new ErrorHandler(400, 'You cannot delete the General notebook');

    if (move) {
      const generalNotebook = Notebook.find({ user: req.user._id, title: 'General' });

      await Note.updateMany({ notebook: id }, { notebook: generalNotebook._id });
    } else {
      await Note.deleteMany({ notebook: id });
    }

    res.json(deletedNotebook);
  } catch (error) {
    next(error);
  }
}