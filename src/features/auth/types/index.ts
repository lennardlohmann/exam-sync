import {
  signInWithPasswordSchema,
  signUpWithEmailSchema,
} from '@/features/auth/validation';
import { z } from 'zod';

export interface UpdateOwnSettingsArgs {
  /**
   * The first name of the user.
   */
  firstName: string;
  /**
   * The last name of the user.
   */
  lastName: string;
  /**
   * Whether the user wants to receive email reminders.
   */
  notifyMe: boolean;
  /**
   * Whether the user wants to receive email reminders.
   */
  emailReminders: boolean;
}

export type SignInWithPasswordArgs = z.infer<typeof signInWithPasswordSchema>;

export type SignUpWithEmailArgs = z.infer<typeof signUpWithEmailSchema>;

export type ServiceResult<T = object> =
  | {
      ok: false;
      error: string;
      cause?: string | unknown;
    }
  | {
      ok: true;
      data: T;
    };
