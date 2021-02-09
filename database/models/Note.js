const mongoose = require('mongoose');

const Notebook = require('../models/Notebook');

const noteSchema = mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notebook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notebook',
    set: function(notebook) {
      this._previousNotebook = this.notebook;
      return notebook;
    }
  }
}, {
  timestamps: true
});

noteSchema.pre('save', async function (next) {
  // Add note to notebook's notes list
  if (this.isNew) {
    try {
      const notebook = await Notebook.findById(this.notebook);

      notebook.notes = [...notebook.notes, this._id];
      notebook.updatedAt = new Date();

      await notebook.save();
    } catch (error) {
      console.log("Error saving note in notebook's notes", error);
    }
  }

  // When moving note, delete note from previous notebook's notes list and add it to the new notebook
  if (this.isModified('notebook')) {
    try {
      const previousNotebookID = this._previousNotebook;

      const previousNotebook = await Notebook.findById(previousNotebookID);
      const newNotebook = await Notebook.findById(this.notebook);
  
      previousNotebook.notes = previousNotebook.notes.filter(note => note._id !== this._id);
      newNotebook.notes = [...newNotebook.notes, this._id];
  
      previousNotebook.updatedAt = new Date();
      newNotebook.updatedAt = new Date();
  
      await previousNotebook.save();
      await newNotebook.save();
    } catch (error) {
      console.log("Error moving note", error);
    }
  }

  next();
});

noteSchema.pre('findOneAndDelete', async function(next) {
  // Remove note from notes list in notebook
  try {
    const notebook = await Notebook.findById(this._id);

    notebook.notes = notebook.notes.filter(note => note._id !== this._id);
    notebook.updatedAt = new Date();

    await notebook.save();
  } catch (error) {
    console.log("Error while deleting note", error);
  }

  next();
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;