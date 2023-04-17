class EmailNotUniqueError extends Error {
  constructor(message) {
    super(message);

    this.status = 0;
    this.error = {
      fields: {
        email: 'NOT_UNIQUE'
      },
      code: this.message
    };

    Object.setPrototypeOf(this, EmailNotUniqueError.prototype);
  }

  serializeErrors() {
    return [{ status: this.status, error }];
  }
}

module.exports = EmailNotUniqueError;
