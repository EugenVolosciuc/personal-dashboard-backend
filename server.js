const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { v4: uuid } = require('uuid');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const connectToDB = require('./database/connect');
const { handleError } = require('./utils/errorHandler');
const { passport, initializePassport } = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// CONFIG
require('dotenv').config();
app.use(express.json());

// Redis config
if (isProduction) {
  const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    no_ready_check: true
  });

  redisClient.on('error', (err) => {
    console.log('Redis error: ', err);
  });
}


app.use(cors({
  credentials: true,
  origin: [process.env.FRONTEND_LOCAL_LINK, process.env.FRONTEND_DEV_LINK]
}));

app.set('trust proxy');

app.use(session({
  genid: () => {
    return uuid()
  },
  ...(isProduction
    ? { store: new RedisStore({ client: redisClient }) }
    : null
  ),
  proxy: true,
  secret: process.env.SESSION_SECRET,
  resave: false,
  name: "pd_session",
  cookie: {
    secure: isProduction ? true : false, 
    sameSite: isProduction ? 'none' : false, 
    maxAge: 60000 * 60 * 24 // 1 minute * 60 minutes * 24 hours = 1 day
  },
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
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`));
