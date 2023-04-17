const express = require('express');
const { createSession } = require('../handlers/session');

const router = express.Router();

router.post('/', createSession);

module.exports = router;