const auth = (req, res, next) => {
  if (req.user) return next();

  res.status(401).json({ message: 'Please authenticate' });
}

module.exports = auth;