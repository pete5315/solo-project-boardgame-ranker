const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const userListRouter = require('./routes/userlist.router');
const newListRouter = require('./routes/newlist.router');
const addGameRouter = require('./routes/addgame.router');
const randomGameRouter = require('./routes/randomgame.router');
const updateRankRouter = require('./routes/updaterank.router');
const rankedListRouter = require('./routes/rankedlist.router');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/userlist', userListRouter);
app.use('/api/newlist', newListRouter);
app.use('/api/addgame', addGameRouter);
app.use('/api/randomgames', randomGameRouter);
app.use('/api/updaterank', updateRankRouter);
app.use('/api/rankedlist', rankedListRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
