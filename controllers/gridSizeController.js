const GridSize = require('../database/models/GridSize');

module.exports.getGridSize = async (req, res, next) => {
  const { width, height } = req.query;

  try {
    let gridSize = await GridSize.findOne({ width, height });

    if (!gridSize) {
      gridSize = await GridSize.create({ width, height });
    }

    res.json(gridSize);
  } catch (error) {
    next(error);
  }
}