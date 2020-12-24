const express = require('express');
const cors = require('cors');
const session = require('express-session');

const connectToDB = require('./database/connect');
const { handleError } = require('./utils/errorHandler');
// const initializePassport = require('./config/passport');
const { passport, initializePassport } = require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3001;

// Config
require('dotenv').config();
app.use(express.json());
app.use(cors({ 
    credentials: true, 
    origin: process.env.FRONTEND_DEV_LINK // TODO: add production link when will launch product
})); 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}));

connectToDB();

// Auth
app.use(passport.initialize());
app.use(passport.session());
initializePassport(passport);

app.use('/users', require('./routes/userRoutes'));
app.use('/notes', require('./routes/noteRoutes'));
app.use('/grid-sizes', require('./routes/gridSizeRoutes'));
app.use('/widget-positions', require('./routes/widgetPositionRoutes'));

// Error handling
app.use((err, req, res, next) => {
    handleError(err, res);
});

app.listen(PORT, console.log(`Server is running on ${process.env.NODE_ENV} on port ${PORT}`));
