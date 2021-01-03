const WidgetPosition = require('../database/models/WidgetPosition');
const { ErrorHandler } = require('../utils/errorHandler');
const checkAndUpdateProperties = require('../utils/updatablePropertyChecker');

// @desc    Get widget positions of specified grid size and user
// @route   GET /widget-positions
// @access  Private
module.exports.getWidgetPositions = async (req, res, next) => {
  const { gridSize } = req.query;

  try {
    const widgetPositions = await WidgetPosition.find({ gridSize, user: req.user._id });

    res.json(widgetPositions);
  } catch (error) {
    next(error);
  }
}

// @desc    Add new widget for specified grid size
// @route   POST /widget-positions
// @access  Private
module.exports.addWidgetPosition = async (req, res, next) => {
  try {
    const widgetPosition = await WidgetPosition.create({ ...req.body, user: req.user._id });

    res.status(201).json(widgetPosition);
  } catch (error) {
    next(error);
  }
}

// @desc    Modify widget position
// @route   PATCH /widget-positions/:id
// @access  Private
module.exports.updateWidgetPosition = async (req, res, next) => {
  const possibleUpdates = Object.keys(WidgetPosition.schema.obj);
  const dataToUpdate = req.body;
  const { id } = req.params;

  try {
    const widgetPosition = await WidgetPosition.findById(id);
    if (!widgetPosition) throw new ErrorHandler(404, 'Widget position not found');

    checkAndUpdateProperties(widgetPosition, dataToUpdate, possibleUpdates);

    await widgetPosition.save();
    res.json(widgetPosition);
  } catch (error) {
    next(error);
  }
}

// @desc    Delete widget position
// @route   DELETE /widget-positions/:id
// @access  Private
module.exports.deleteWidgetPosition = async (req, res, next) => {
  const { id } = req.params;

  try {
    const widgetPosition = await WidgetPosition.findByIdAndDelete(id);

    if (!widgetPosition) throw new ErrorHandler(404, 'Widget position not found');

    res.json(widgetPosition);
  } catch (error) {
    next(error);
  }
}