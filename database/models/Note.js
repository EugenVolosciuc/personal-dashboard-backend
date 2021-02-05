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
    ref: 'Notebook'
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

  // TODO: if moving note, delete note from previous notebook's notes list and add it to the new notebook
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;