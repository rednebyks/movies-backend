class MovieNotFoundError extends Error {
  constructor(message, id) {
    super(message);

    this.status = 0;
    this.error = {
      fields: {
        id,
      },
      code: this.message
    };

    Object.setPrototypeOf(this, MovieNotFoundError.prototype);
  }

  serializeErrors() {
    return [{ status: this.status, error }];
  }
}

module.exports = MovieNotFoundError;
