const mongoose = require('mongoose');

const widgetPositionSchema = mongoose.Schema({
  gridSize: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GridSize'
  },
  x: {
    type: Number,
    required: [true, 'X is required']
  },
  y: {
    type: Number,
    required: [true, 'Y is required']
  },
  width: {
    type: Number,
    required: [true, 'Widget width is required']
  },
  height: {
    type: Number,
    required: [true, 'Widget width is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  type: {
    type: String,
    required: [true, 'Type is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const WidgetPosition = mongoose.model('WidgetPosition', widgetPositionSchema);

module.exports = WidgetPosition;