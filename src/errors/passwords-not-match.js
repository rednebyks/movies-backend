class PasswordsNotMatchError extends Error {
  constructor(message) {
    super(message);

    this.status = 0;
    this.error = {
      fields: {
        title: 'NOT_MATCH'
      },
      code: this.message
    };

    Object.setPrototypeOf(this, PasswordsNotMatchError.prototype);
  }

  serializeErrors() {
    return [{ status: this.status, error }];
  }
}

module.exports = PasswordsNotMatchError;
