import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, {
    message: 'The password has to contain at least 8 digits.',
  })
  .regex(/[A-Z]/, {
    message: 'The password must contain at least one upper case letter',
  })
  .regex(/[a-z]/, {
    message: 'The password must contain at least one lower case letter',
  })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'The password must contain at least one special character',
  })
  .regex(/[0-9]/, {
    message: 'The password must contain at least one number',
  });

export const signInWithPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: passwordSchema,
});

export const signUpWithEmailSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: passwordSchema,
});
