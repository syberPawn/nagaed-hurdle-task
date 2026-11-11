import { z } from 'zod';

// Limits mirror the column sizes in sql/init.sql.
// Unknown keys in the request body are stripped by z.object() by default.

export const registerSchema = z.object({
  username: z
    .string({ error: 'Username is required' })
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[A-Za-z0-9_.-]+$/, 'Username may only contain letters, numbers, _ . and -'),

  email: z
    .string({ error: 'Email is required' })
    .trim()
    .toLowerCase()
    .max(255, 'Email must be at most 255 characters')
    .pipe(z.email('Email is invalid')),

  // bcrypt only uses the first 72 bytes of a password, so longer ones are rejected
  // rather than silently truncated.
  password: z
    .string({ error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .refine((value) => Buffer.byteLength(value, 'utf8') <= 72, 'Password must be at most 72 bytes'),

  address: z
    .string({ error: 'Address is required' })
    .trim()
    .min(1, 'Address is required')
    .max(255, 'Address must be at most 255 characters'),
});

// Login only checks that the fields are present and well-formed. Password rules
// (length etc.) are not re-checked here: a wrong password is simply "Invalid credentials".
export const loginSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .trim()
    .toLowerCase()
    .pipe(z.email('Email is invalid')),

  password: z.string({ error: 'Password is required' }).min(1, 'Password is required'),
});
