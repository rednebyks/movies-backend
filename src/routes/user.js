const express = require('express');
const { createUser } = require('../handlers/user');
const validateRequest = require('../middleware/validateRequest');
const { userSchema } = require('../schemas/index');

const router = express.Router();

router.post(
  '/',
  userSchema,
  validateRequest,
  createUser
);

module.exports = router;