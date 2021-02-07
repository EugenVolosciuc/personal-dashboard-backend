const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { v4: uuid } = require('uuid');
// const redis = require('redis');
const redisStore = require('connect-redis')(session);

const connectToDB = require('./database/connect');
const { handleError } = require('./utils/errorHandler');
const { passport, initializePassport } = require('./config/passport');

// const redisClient = redis.createClient();

const app = express();
const PORT = process.env.PORT || 3001;

// Log redis error
// redisClient.on('error', (err) => {
//   console.log('Redis error: ', err);
// });

// CONFIG
require('dotenv').config();
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: [process.env.FRONTEND_LOCAL_LINK, process.env.FRONTEND_DEV_LINK] // TODO: add production link when will launch product
}));
app.use(session({
  genid: () => {
    return uuid()
  },
  ...(process.env.NODE_ENV === 'production'
    ? { store: new redisStore({ host: process.env.REDIS_DEV_HOST, port: process.env.REDIS_DEV_PORT, client: redisClient }) }
    : {}
  ),
  name: 'REDIS_SESSION_CACHE',
  secret: process.env.SESSION_SECRET,
  resave: true,
  name: "PD_SESSION",
  // cookie: { secure: true, maxAge: 60000 * 60 * 24 }, // 1 minute * 60 minutes * 24 hours = 1 day
  saveUninitialized: false
}));

connectToDB();

// AUTH
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

// ROUTES
// Widgets
app.use('/notes', require('./routes/noteRoutes'));
app.use('/notebooks', require('./routes/notebookRoutes'));
app.use('/todos', require('./routes/todoRoutes'));
app.use('/weather', require('./routes/weatherRoutes'));

// Others
app.use('/users', require('./routes/userRoutes'));
app.use('/grid-sizes', require('./routes/gridSizeRoutes'));
app.use('/widget-positions', require('./routes/widgetPositionRoutes'));

// ERROR HANDLING
app.use((err, req, res, next) => {
  handleError(err, res);
});

// RUN SERVER
app.listen(PORT, console.log(`Server is running on ${process.env.NODE_ENV} on port ${PORT}`));
