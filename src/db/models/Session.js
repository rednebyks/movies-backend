const { Model, DataTypes } = require('sequelize')
const sequelize = require('../index')

class Session extends Model {}

Session.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'session'
})

module.exports = Session;