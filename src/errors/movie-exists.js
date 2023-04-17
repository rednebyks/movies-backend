class MovieExistsError extends Error {
  constructor(message) {
    super(message);

    this.status = 0;
    this.error = {
      fields: {
        title: 'NOT_UNIQUE'
      },
      code: this.message
    };

    Object.setPrototypeOf(this, MovieExistsError.prototype);
  }

  serializeErrors() {
    return [{ status: this.status, error }];
  }
}

module.exports = MovieExistsError;
