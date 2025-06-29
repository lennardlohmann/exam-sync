import { signInWithPasswordSchema, signUpWithEmailSchema } from '../validation';
import {
  ServiceResult,
  SignInWithPasswordArgs,
  SignUpWithEmailArgs,
} from '../types';
import { createClient } from '@/utils/supabase/client';

export async function signInWithPassword(
  args: SignInWithPasswordArgs
): Promise<ServiceResult<void>> {
  try {
    const parseRes = await signInWithPasswordSchema.safeParseAsync(args);
    if (!parseRes.success) {
      return {
        ok: false,
        error: parseRes.error.message,
      };
    }

    const { email, password } = parseRes.data;

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        ok: false,
        error: error.message,
      };
    }

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        ok: false,
        error: error.message,
      };
    }

    return {
      ok: false,
      error: 'Ein unbekannter Fehler ist aufgetreten.',
    };
  }
}

export async function signUpWithPassword(
  args: SignUpWithEmailArgs
): Promise<ServiceResult<void>> {
  try {
    console.log('signUpWithPassword called with args:', args);

    const parseRes = await signUpWithEmailSchema.safeParseAsync(args);
    if (!parseRes.success) {
      console.log('Validation failed:', parseRes.error.message);
      return {
        ok: false,
        error: parseRes.error.message,
      };
    }

    const { firstName, lastName, email, password } = parseRes.data;
    console.log('Validated data:', {
      firstName,
      lastName,
      email,
      password: '***',
    });

    const supabase = createClient();
    console.log('Supabase client created');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    console.log('Supabase signUp response:', { data, error });

    if (error) {
      console.log('SignUp error:', error);
      return {
        ok: false,
        error: error.message,
      };
    }

    console.log('SignUp successful:', data);
    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    console.error('SignUp exception:', error);
    if (error instanceof Error) {
      return {
        ok: false,
        error: error.message,
      };
    }

    return {
      ok: false,
      error: 'Ein unbekannter Fehler ist aufgetreten.',
    };
  }
}
