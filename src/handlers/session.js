const Session = require('../db/models/Session');
const User = require('../db/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AuthenticationFailedError = require('../errors/authentication-failed');
const { JWT_SECRET } = require('../constants');

const createToken = (email) => {
  return jwt.sign({ email }, JWT_SECRET);
}

const createSession = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if(!user) {
      throw new AuthenticationFailedError('AUTHENTICATION_FAILED');
    }

    const result = await bcrypt.compare(password, user.password);
    if(!result) {
      throw new AuthenticationFailedError('AUTHENTICATION_FAILED');
    }

    await Session.create({
      email,
      password: user.password,
    });
    const token = createToken(email)

    res.status(200).json({ token, status: 1 });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}

module.exports = {
  createSession
}