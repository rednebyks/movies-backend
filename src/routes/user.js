const express = require('express');
const { createUser } = require('../handlers/user');

const router = express.Router();

router.post('/', createUser);

module.exports = router;