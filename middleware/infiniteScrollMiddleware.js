const { ErrorHandler } = require('../utils/errorHandler');

const infiniteScroll = (model, populatedFields) => {
  return async (req, res, next) => {
    try {
      const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy) : { createdAt: 'descending' };
      const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
      const skip = req.query.skip;

      let query = model.find(filters).sort(sortBy).skip(skip).limit(10);

      if (Array.isArray(populatedFields)) {
        query = query.populate(populatedFields);
      }

      const items = await query.exec();
      res.items = items;

      next();
    } catch (error) {
      throw new ErrorHandler(error.status, error.message, error);
    }
  }
}

module.exports = infiniteScroll;