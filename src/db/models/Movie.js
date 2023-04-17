const { Model, DataTypes } = require('sequelize');
const sequelize = require('../index');

const Movie = sequelize.define('movie', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  format: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = Movie;