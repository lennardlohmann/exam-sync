import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function RedirectPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect('/auth/login');
  }

  const role = session.user.role;

  if (role === 'admin') {
    return redirect(AdminRoutes.DASHBOARD);
  }

  if (role === 'company') {
    return redirect(CompanyRoutes.DASHBOARD);
  }

  return redirect(UserRoutes.DASHBOARD);
}
