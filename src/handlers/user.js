const User = require('../db/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const EmailNotUniqueError = require('../errors/email-not-unique');

const createToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET);
}

const createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if(user) {
      throw new EmailNotUniqueError('EMAIL_NOT_UNIQUE');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await User.create({
      email,
      name,
      password: hash,
      confirmPassword: hash,
    });
    const token = createToken(email)

    res.status(200).json({ token, status: 1 });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}

module.exports = {
  createUser
}