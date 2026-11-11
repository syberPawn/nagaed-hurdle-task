// Every error response from the API has the shape:
//   { "error": { "message": string, "details"?: any } }

// Runs when no route matched the request.
export function notFound(req, res) {
  res.status(404).json({
    error: { message: `Route not found: ${req.method} ${req.originalUrl}` },
  });
}

// Express recognises error-handling middleware by its four arguments.
// Anything thrown (or passed to next(err)) in a route ends up here.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Body was not valid JSON (thrown by express.json()).
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: { message: 'Malformed JSON in request body' } });
  }

  const status = err.statusCode || err.status || 500;

  // Unexpected errors: log the details on the server, but never leak them to the client.
  if (status >= 500) {
    console.error(err);
    return res.status(500).json({ error: { message: 'Internal server error' } });
  }

  const body = { error: { message: err.message } };
  if (err.details) body.error.details = err.details;
  res.status(status).json(body);
}
