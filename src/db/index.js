const { Sequelize } = require('sequelize');
const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
} = require('../constants');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: 'sqlite',
  storage: './dev.sqlite'
});

sequelize.sync();

module.exports = sequelize;

const Actor = require('./models/Actor');
const Movie = require('./models/Movie');

Movie.belongsToMany(Actor, {
  through: 'MovieActor',
  as: 'actors',
  foreignKey: 'movieId',
});

Actor.belongsToMany(Movie, {
  through: 'MovieActor',
  as: 'movie',
  foreignKey: 'actorId',
});