require('dotenv').config();

const {
  APP_PORT,
  JWT_SECRET,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
} = process.env;

module.exports = {
  APP_PORT,
  JWT_SECRET,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
}