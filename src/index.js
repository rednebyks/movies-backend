const express = require('express');
const sequelize = require('./db');
const userRouter = require('./routes/user');
const sessionRouter = require('./routes/session');
const movieRouter = require('./routes/movie');
const { APP_PORT } = require('./constants');

sequelize.sync();

const app = express();

app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/sessions', sessionRouter);
app.use('/api/v1/movies', movieRouter);

app.listen((APP_PORT), () => {
  console.log(`\nServer started successfully - http://localhost:${APP_PORT}`);
});
