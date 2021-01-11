const mongoose = require('mongoose');

const notebookSchema = mongoose.Schema({
  title: {
    type: 'String',
    required: [true, 'Notebook title is required']
  },
  notes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }]
});

const Notebook = mongoose.model('Notebook', notebookSchema);

module.exports = Notebook;