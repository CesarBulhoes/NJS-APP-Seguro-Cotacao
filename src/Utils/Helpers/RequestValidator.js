const { MissingParamError } = require('../Errors');

class RequestValidator {
  constructor({ schema } = {}) {
    this.schema = schema;
  }

  validate(params) {
    if (!params) throw new MissingParamError('params');

    const { value, error: erro } = this.schema.validate(params, {
      abortEarly: false,
      convert: false,
      allowUnknown: true,
      stripUnknown: true
    });
    return { value, erro };
  }
}

module.exports = RequestValidator;
