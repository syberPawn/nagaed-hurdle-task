import HttpError from '../utils/HttpError.js';

// Returns middleware that validates req.body against a Zod schema.
// On success, req.body is replaced with the parsed (trimmed, normalised, stripped) data.
// On failure, responds 400 with one message per invalid field, e.g.
//   { "error": { "message": "Validation failed", "details": { "email": "Email is invalid" } } }
export function validateBody(schema) {
  return (req, res, next) => {
    // Express 5 leaves req.body undefined when the request has no JSON body.
    const result = schema.safeParse(req.body ?? {});

    if (!result.success) {
      const details = {};
      for (const issue of result.error.issues) {
        const field = issue.path.join('.') || 'body';
        details[field] ??= issue.message; // keep the first message per field
      }
      throw new HttpError(400, 'Validation failed', details);
    }

    req.body = result.data;
    next();
  };
}
