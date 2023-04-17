const { Model, DataTypes } = require('sequelize');
const sequelize = require('../index');

const Actor = sequelize.define('actor', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

module.exports = Actor;