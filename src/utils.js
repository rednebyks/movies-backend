const jwt = require('jsonwebtoken');
const fs = require('fs');
const { JWT_SECRET } = require('./constants');

const validateAccessToken = (token) => {
  try {
    const userData = jwt.verify(token, JWT_SECRET);
    return userData;
  } catch (e) {
    return null;
  }
};

const getMoviesFromFile = (path) => {
  const moviesData = fs.readFileSync(path, 'utf8');

  const movies = moviesData.split('\n\n').map(movieData => {
    const movieLines = movieData.split('\n');
    const movie = {};
    movieLines.forEach(line => {
      const [field, value] = line.split(': ');
      if (field === 'Stars') {
        movie[field] = value.split(', ');
      } else {
        movie[field] = value;
      }
    });
    return movie;
  });

  return movies;
}

module.exports = {
  validateAccessToken,
  getMoviesFromFile,
};