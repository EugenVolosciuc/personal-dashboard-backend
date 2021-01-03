const axios = require('axios');

const { ErrorHandler } = require('../utils/errorHandler');

const OWM_BASE_URL = 'http://api.openweathermap.org'

// @desc    Get weather of user's location
// @route   GET /weather
// @access  Private
module.exports.getWeather = async (req, res, next) => {
  const { latitude, longitude } = req.user.location;

  try {
    const url = `${OWM_BASE_URL}/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=${req.user.units}&appid=${process.env.OPEN_WEATHER_API_KEY}`;
    const { data } = await axios.get(url);

    res.json(data);
  } catch (error) {
    console.log("ERROR", error)
    next(error);
  }
}

// @desc    Get coordinates of city
// @route   GET /weather/coordinates
// @access  Private
module.exports.getCoordinates = async (req, res, next) => {
  const { search } = req.query;

  if (!search) throw new ErrorHandler(400, 'No search parameter was provided');

  try {
    const { data } = await axios.get(`${OWM_BASE_URL}/geo/1.0/direct?q=${search}&appid=${process.env.OPEN_WEATHER_API_KEY}`);

    console.log("DATA", data)

    res.json(data);
  } catch (error) {
    next(error);
  }
}