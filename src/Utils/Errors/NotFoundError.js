class NotFoundError extends Error {
  constructor(description) {
    super(`NotFoundError: ${description}`);
    this.description = description;
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
