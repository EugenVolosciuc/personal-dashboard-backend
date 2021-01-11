const mongoose = require('mongoose');

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

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;

