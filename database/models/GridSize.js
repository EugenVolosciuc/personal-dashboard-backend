const mongoose = require('mongoose');

const gridSizeSchema = mongoose.Schema({
  width: {
    type: Number,
    required: [true, 'Width is required']
  },
  height: {
    type: Number,
    required: [true, 'Height is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  widgetPositions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WidgetPosition'
  }]
});

const GridSize = mongoose.model('GridSize', gridSizeSchema);

module.exports = GridSize;