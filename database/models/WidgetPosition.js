const mongoose = require('mongoose');

const GridSize = require('./GridSize');

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
  },
});

widgetPositionSchema.pre('save', async function (next) {
  // Update widgetPositions field in grid size
  try {
    const gridSize = await GridSize.findById(this.gridSize);

    gridSize.widgetPositions = [...gridSize.widgetPositions, this._id];

    await gridSize.save();
  } catch (error) {
    next(error);
  }

  next();
});

const WidgetPosition = mongoose.model('WidgetPosition', widgetPositionSchema);

module.exports = WidgetPosition;