const User = require('../database/models/User');
const { ErrorHandler } = require('../utils/errorHandler');
const checkAndUpdateProperties = require('../utils/updatablePropertyChecker');
const { passport } = require('../config/passport');

const maxAge = 3 * 24 * 60 * 60; // days, hours, minutes, seconds

// @desc    Get logged in user
// @route   GET /users/me
// @access  Public
module.exports.getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
}

// @desc    Create user
// @route   POST /users
// @access  Public
module.exports.createUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new ErrorHandler(400, [{ field: 'email', message: 'A user with this email already exists' }]);
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

// @desc    Modify user
// @route   PATCH /users
// @access  Private
module.exports.modifyUser = async (req, res, next) => {
  const possibleUpdates = Object.keys(User.schema.obj);
  const dataToUpdate = req.body;
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) throw new ErrorHandler(404, 'User not found');

    checkAndUpdateProperties(user, dataToUpdate, possibleUpdates);

    await user.save();

    res.json(user);
  } catch (error) {
    next(error);
  }
}

// @desc    Login user
// @route   POST /users/login
// @access  Public
module.exports.loginUser = async (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      next(error);
    }

    try {
      if (!user) throw new ErrorHandler(400, 'Incorrect credentials');

      req.logIn(user, error => {
        if (error) next(error);

        res.json(user);
      })
    } catch (error) {
      next(error);
    }
  })(req, res, next);
}

// @desc    Logout user
// @route   POST /users/login
// @access  Private
module.exports.logoutUser = (req, res) => {
  req.logout();
  res.json();
}