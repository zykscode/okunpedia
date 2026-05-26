import * as z from 'zod';

const COMMON_PASSWORDS = [
  'password123',
  'password12345',
  '123456789012',
  'qwertyuiopasdf',
  'administrator1',
  'change_me_now1',
];

export const SignUpValidation = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters long.')
    .max(30, 'Username must not exceed 30 characters.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.'),
  email: z.string()
    .email('Please enter a valid email address.'),
  password: z.string()
    .min(12, 'Password must be at least 12 characters long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
}).refine((data) => {
  const emailPrefix = data.email.split('@')[0] || '';
  return !data.password.toLowerCase().includes(emailPrefix.toLowerCase()) &&
         !data.password.toLowerCase().includes(data.email.toLowerCase());
}, {
  message: 'Password must not be similar to your email address.',
  path: ['password'],
}).refine((data) => {
  return !COMMON_PASSWORDS.some((p) => data.password.toLowerCase().includes(p));
}, {
  message: 'Password is too common. Please choose a stronger one.',
  path: ['password'],
});

export const SignInValidation = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});
