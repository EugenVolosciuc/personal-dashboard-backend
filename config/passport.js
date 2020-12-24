const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const passport = require('passport');

const User = require('../database/models/User');
const { ErrorHandler } = require('../utils/errorHandler');

const initializePassport = function (passport) {
  passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (await bcrypt.compare(password, user.password)) {
          return done(null, user);
        } else {
          throw new ErrorHandler(400, 'Incorrect credentials');
        }
      } catch (error) {
        done(null, false)
        throw new ErrorHandler(error.status, error.message);
      }
    }));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });
}

module.exports = {
  initializePassport,
  passport
}