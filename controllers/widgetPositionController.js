const WidgetPosition = require('../database/models/WidgetPosition');
const { ErrorHandler } = require('../utils/errorHandler');
const checkAndUpdateProperties = require('../utils/updatablePropertyChecker');

module.exports.getWidgetPositions = async (req, res, next) => {
  const { gridSize } = req.query;

  try {
    const widgetPositions = await WidgetPosition.find({ gridSize, user: req.user._id });

    res.json(widgetPositions);
  } catch (error) {
    next(error);
  }
}

module.exports.addWidgetPosition = async (req, res, next) => {
  try {
    const widgetPosition = await WidgetPosition.create({ ...req.body, user: req.user._id });

    res.status(201).json(widgetPosition);
  } catch (error) {
    next(error);
  }
}

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