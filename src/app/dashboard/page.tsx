import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Dashboard } from '@/components/Dashboard';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/auth/login');
  }

  return <Dashboard user={session.user} />;
}
