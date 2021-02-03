const mongoose = require('mongoose');

const notebookSchema = mongoose.Schema({
  title: {
    type: 'String',
    required: [true, 'Notebook title is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }]
}, {
  timestamps: true
});

const Notebook = mongoose.model('Notebook', notebookSchema);

module.exports = Notebook;