const Actor = require('../db/models/Actor');
const Movie = require('../db/models/Movie');
const { Op } = require('sequelize');
const sequelize = require('../db');

class MovieService {
  async getByTitle(title) {
    return Movie.findOne({ where: { title } });
  }

  async getById(id) {
    return Movie.findByPk(id);
  }

  async getLastMovieId() {
    const movie = await Movie.findAll({
      limit: 1,
      order: [ [ 'id', 'DESC' ]]
    });
    return movie.id ? movie.id : 0;
  }

  async getImported(lastMovieId) {
    return Movie.findAndCountAll({
      where: { id: { [Op.gt]: lastMovieId } }
    });
  }

  async getOne(id) {
    const movie = await Movie.findOne({
      where: { id },
      include: [
        {
          model: Actor,
          as: 'actors',
          through: {
            attributes: []
          },
        },
      ],
      order: [[{ model: Actor, as: 'actors' }, 'id', 'ASC']]
    });
    return {
      id: movie.id,
      title: movie.title,
      year: movie.year,
      format: movie.format,
      actors: movie.actors,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt
    }
  }

  async createMovieAndActor(actors, title, year, format) {
    const actorsArray = [];
    const movie = await Movie.create({ title, year, format });
    for(const actorName of actors) {
      const [actor] = await Actor.findOrCreate({ where: { name: actorName } });
      actorsArray.push(actor);
    }
    await Promise.all(actorsArray.map(actor => movie.addActor(actor)));
    return this.getOne(movie.id);
  }

  async deleteOne(id) {
    return Movie.destroy({ where: { id } });
  }

  async getList(
    whereTitle,
    whereActor,
    combinedWhere,
    sort='id',
    order='ASC',
    offset=0,
    limit=20
  ) {
    const where = combinedWhere ? combinedWhere : whereTitle;
    const movies = await Movie.findAndCountAll({
      where,
      include: {
        model: Actor,
        as: 'actors',
        where: whereActor,
        attributes: [],
        required: true,
      },
      order: [[sequelize.fn('lower', sequelize.col(`${sort}`)), `${order}`]],
      offset,
      limit,
      subQuery: false,
      distinct: true
    });
    return {
      data: movies.rows,
      meta: { total: movies.count },
    }
  }

  async updateMovie(id, title, year, format, actors) {
    const actorsToAdd = [];
    const movie = await Movie.findByPk(id);
    const currentActors = await movie.getActors();

    const actorsToRemove = currentActors.filter(a => !actors.includes(a.name));
    if(actorsToRemove.length > 0) {
      await Promise.all(actorsToRemove.map(a => movie.removeActor(a)));
    }

    const currentActorsNames = currentActors.map(b => b.name);
    for(const actorName of actors) {
      const [actor] = await Actor.findOrCreate({ where: { name: actorName } });
      if(!currentActorsNames.includes(actor.name)) {
        actorsToAdd.push(actor);
      }
    }

    if(actorsToAdd.length > 0) {
      await Promise.all(actorsToAdd.map(actor => movie.addActor(actor)));
    }

    movie.title = title;
    movie.year = year;
    movie.format = format;
    movie.save();

    return this.getOne(movie.id);
  }

  async importMovies(movies) {
    const lastMovieId = await this.getLastMovieId();
    for(const m of movies) {
      await this.createMovieAndActor(m.Stars, m.Title, m['Release Year'], m.Format);
    }
    const data = await this.getImported(lastMovieId);
    const total = await Movie.count();
    return {
      rows: data.rows,
      meta: { imported: data.count, total }
    }
  }
}

module.exports = new MovieService();