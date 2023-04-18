const express = require('express');
const multer  = require('multer');
const {
  createMovie,
  deleteMovie,
  showOne,
  showList,
  updateMovie,
  uploadMovies,
} = require('../handlers/movie');
const { requireAuth } = require('../middleware/requireAuth');
const upload = multer({ dest: 'movies/' });
const validateRequest = require('../middleware/validateRequest');
const { movieSchema } = require('../schemas/index');

const router = express.Router();

router.use(requireAuth);

router.post(
  '/',
  movieSchema,
  validateRequest,
  createMovie
);

router.delete('/:id', deleteMovie);

router.get('/:id', showOne);

router.get('/', showList);

router.patch(
  '/:id',
  movieSchema,
  validateRequest,
  updateMovie
);

router.post('/import', upload.single('movies'), uploadMovies);

module.exports = router;