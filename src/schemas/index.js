const { body } = require('express-validator');

const allowedFormats = ['VHS', 'DVD', 'Blu-Ray'];

const userSchema = [
  body('email').isEmail().withMessage('Email must contain a valid email address'),
  body('name').trim().isLength({ min: 2 }).withMessage('Name should be at least 3 characters long'),
  body('password').trim().notEmpty().withMessage('Password should not be empty'),
  body('confirmPassword').trim().notEmpty().withMessage('Password confirm should not be empty'),
];

const sessionSchema = [
  body('email').isEmail().withMessage('Email must contain a valid email address'),
  body('password').trim().notEmpty().withMessage('Password should not be empty'),
];

const movieSchema = [
  body('title').trim().notEmpty().withMessage('Title should not be empty'),
  body('year').isInt({ min: 1850, max: 2023 }).withMessage('Year should be of integer type and fall into range [1850, 2023]'),
  body('format').isIn(allowedFormats).withMessage(`Allowed fromats are ${allowedFormats}`)
];

module.exports = {
  userSchema,
  sessionSchema,
  movieSchema,
};