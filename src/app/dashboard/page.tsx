import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/auth/login');
  }

  // For now, redirect all users to a simple dashboard
  // You can implement role-based routing later
  return redirect('/');
}
