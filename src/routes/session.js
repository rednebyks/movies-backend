const express = require('express');
const { createSession } = require('../handlers/session');
const validateRequest = require('../middleware/validateRequest');
const { sessionSchema } = require('../schemas/index');

const router = express.Router();

router.post(
  '/',
  sessionSchema,
  validateRequest,
  createSession
);

module.exports = router;