const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const get = require('lodash/get');

const { ErrorHandler } = require('../../utils/errorHandler');
const Notebook = require('../models/Notebook');

const MQ_BASE_URL = 'http://www.mapquestapi.com/geocoding/v1/reverse'

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Please provide a username']
  },
  email: {
    type: String,
    unique: true,
    validate: [isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Minimum password length is 6 characters']
  },
  location: {
    type: Object
  },
  units: {
    type: String,
    default: 'metric'
  }
}, {
  timestamps: true
});

// Remove password from the returned user object
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
}

// Login method
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if (auth) return user;
  }

  throw new ErrorHandler(401, 'Incorrect email or password');
}


userSchema.pre('save', async function (next) {
  // Hash password before saving user to DB
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // If user added location automatically with the browser's geolocation API, save location city before saving location
  if (this.isModified('location')) {
    const { latitude, longitude, city } = this.location;

    if (!city) {
      try {
        const { data } = await axios.get(`${MQ_BASE_URL}?key=${process.env.MAP_QUEST_API_KEY}&location=${latitude},${longitude}&thumbMaps=false`);

        this.location = {
          ...this.location,
          city: get(data, 'results[0].locations[0].adminArea5', ''),
          // country: get(data, 'results[0].locations[0].adminArea1', ''),
        }
      } catch (error) {
        console.log("Error saving location city and country");
      }
    }
  }

  // Create general notebook
  if (this.isNew) {
    await Notebook.create({ user: this._id, title: 'General' });
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;