const Note = require('../database/models/Note');
const { ErrorHandler } = require('../utils/errorHandler');
const checkAndUpdateProperties = require('../utils/updatablePropertyChecker');

// @desc    Get notes
// @route   GET /notes
// @access  Private
module.exports.getNotes = async (req, res, next) => {
  try {
      if (!res.paginatedResults.notes) throw new ErrorHandler(404, 'No notes found');

      res.json(res.paginatedResults);
  } catch (error) {
      next(error);
  }
}

// @desc    Create notes
// @route   POST /notes
// @access  Private
module.exports.createNote = async (req, res, next) => {
  try {
    const note = await Note.create({...req.body, user: req.user._id});

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
}

// @desc    Create notes
// @route   POST /notes
// @access  Private
module.exports.modifyNote = async (req, res, next) => {
  const possibleUpdates = Object.keys(Note.schema.obj);
  const dataToUpdate = req.body;
  const { id } = req.params;

  try {
    const note = await Note.findById(id);

    if (!note) throw new ErrorHandler(404, 'Note not found');

    checkAndUpdateProperties(note, dataToUpdate, possibleUpdates);

    await note.save();
  } catch (error) {
    next(error);
  }
}