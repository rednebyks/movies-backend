const MovieExistsError = require('../errors/movie-exists');
const MovieNotFoundError = require('../errors/movie-not-found');
const MovieService = require('../services/movie-service');
const { getMoviesFromFile } = require('../utils');



const createMovie = async (req, res) => {
  try {
    const { title, year, format, actors } = req.body;

    const movieExsits = await MovieService.getByTitle(title);
    if(movieExsits) {
      throw new MovieExistsError('MOVIE_EXISTS');
    }

    const data = await MovieService.createMovieAndActor(actors, title, year, format);

    res.status(200).json({ data, status: '1' });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await MovieService.getOne(id);
    if(!movie) {
      throw new MovieNotFoundError('MOVIE_NOT_FOUND', id);
    }

    await MovieService.deleteOne(id);

    res.status(200).json({ status: '1' });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}

const showOne = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await MovieService.getOne(id);
    if(!data) {
      throw new MovieNotFoundError('MOVIE_NOT_FOUND', id);
    }
    
    res.status(200).json({ data, status: '1' });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}

const showList = async (req, res) => {
  try {
    const { title, actor, sort, order, offset, limit } = req.query;

    const whereTitle = title ? { title } : {};
    const whereActor = actor ? { name: actor } : {};
    
    const data = await MovieService.getList(whereTitle, whereActor, sort, order, offset, limit);

    res.status(200).json({ ...data, status: '1' });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}

const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, year, format, actors } = req.body;

    const movie = await MovieService.getById(id);
    if(!movie) {
      throw new MovieNotFoundError('MOVIE_NOT_FOUND', id);
    }

    const data = await MovieService.updateMovie(id, title, year, format, actors);

    res.status(200).json({ data, status: '1' });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}

const uploadMovies = async (req, res) => {
  try {
    const filePath = req.file.path;
    const movies = getMoviesFromFile(filePath);

    const data = await MovieService.importMovies(movies);

    res.status(200).json({ data: data.rows, meta: data.meta, status: '1' });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}

module.exports = {
  createMovie,
  deleteMovie,
  showOne,
  showList,
  updateMovie,
  uploadMovies,
}