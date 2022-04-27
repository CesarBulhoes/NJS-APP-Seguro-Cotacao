const { InternalServerError, NotFoundError } = require('../Errors');

exports.ok = (data) => ({ statusCode: 200, body: data });

exports.badRequest = (error) => ({ statusCode: 400, body: { error: error.message } });

exports.notFound = (error) => ({ statusCode: 404, body: { error: new NotFoundError(error).message } });

exports.exceptionHandler = (error) => ({
  statusCode: error.statusCode || 500,
  body: { error: error.description || new InternalServerError().message }
});
