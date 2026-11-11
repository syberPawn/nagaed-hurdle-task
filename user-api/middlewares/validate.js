import HttpError from '../utils/HttpError.js';

// Builds middleware that validates one part of the request (req.body or req.params)
// against a Zod schema.
// On success, that part is replaced with the parsed (trimmed, converted, stripped) data.
// On failure, responds 400 with one message per invalid field, e.g.
//   { "error": { "message": "Validation failed", "details": { "email": "Email is invalid" } } }
function validate(source, schema) {
  return (req, res, next) => {
    // Express 5 leaves req.body undefined when the request has no JSON body.
    const result = schema.safeParse(req[source] ?? {});

    if (!result.success) {
      const details = {};
      for (const issue of result.error.issues) {
        const field = issue.path.join('.') || source;
        details[field] ??= issue.message; // keep the first message per field
      }
      throw new HttpError(400, 'Validation failed', details);
    }

    req[source] = result.data;
    next();
  };
}

export const validateBody = (schema) => validate('body', schema);
export const validateParams = (schema) => validate('params', schema);
