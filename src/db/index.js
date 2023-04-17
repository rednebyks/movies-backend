const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('movie-db', 'user', 'pass', {
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