// An Error that also carries the HTTP status code to respond with.
// Throw it from any layer; middlewares/errorHandler.js turns it into a JSON response.
//
//   throw new HttpError(409, 'Email already in use');
//   throw new HttpError(400, 'Validation failed', { email: 'Email is invalid' });
export default class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    if (details) this.details = details;
  }
}
