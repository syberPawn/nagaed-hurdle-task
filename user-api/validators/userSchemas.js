import { z } from 'zod';

// URL params always arrive as strings ("1"), so z.coerce converts them to numbers first.
// Upper bound matches the INT UNSIGNED id column in sql/init.sql.
export const userIdParamsSchema = z.object({
  id: z.coerce
    .number({ error: 'User id must be a number' })
    .int('User id must be a whole number')
    .positive('User id must be a positive number')
    .max(4294967295, 'User id is out of range'),
});
