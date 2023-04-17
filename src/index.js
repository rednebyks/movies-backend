require('dotenv').config();

const express = require('express');
const sequelize = require('./db');
const userRouter = require('./routes/user');
const sessionRouter = require('./routes/session');
const movieRouter = require('./routes/movie');

sequelize.sync();

const app = express();

app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/sessions', sessionRouter);
app.use('/api/v1/movies', movieRouter);

app.listen((process.env.PORT), () => {
  console.log(`\nServer started successfully - http://localhost:${process.env.PORT}`);
});
