const NoTokenProvidedError = require('../errors/no-token-provided');
const { validateAccessToken } = require('../utils');
const { JWT_SECRET } = require('../constants');

const requireAuth = async (req, res, next) => {
  try{
    const { authorization } = req.headers;
    if(!authorization) {
      new NoTokenProvidedError();
    }
    
    const token = authorization.split(' ')[1];
    if (!token) {
      throw new NoTokenProvidedError();
    }
    const userData = validateAccessToken(token, JWT_SECRET);
    if(!userData) {
      throw new NoTokenProvidedError();
    }

    req.user = userData;
    next();
  } catch(err) {
    console.log(err);
    return res.status(400).json(err);
  }
}

module.exports = { 
  requireAuth 
};