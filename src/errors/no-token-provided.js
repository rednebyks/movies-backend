class NoTokenProvidedError extends Error {
  constructor() {
    super();

    this.status = 0;
    this.error = {
      fields: {
        token: 'REQUIRED',
      },
      code: 'FORMAT_ERROR'
    };

    Object.setPrototypeOf(this, NoTokenProvidedError.prototype);
  }

  serializeErrors() {
    return [{ status: this.status, error }];
  }
}

module.exports = NoTokenProvidedError;
