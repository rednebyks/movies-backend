class AuthenticationFailedError extends Error {
  constructor(message) {
    super(message);

    this.status = 0;
    this.error = {
      fields: {
        email: message,
        password: message
      },
      code: message
    };

    Object.setPrototypeOf(this, AuthenticationFailedError.prototype);
  }

  serializeErrors() {
    return [{ status: this.status, error }];
  }
}

module.exports = AuthenticationFailedError;
