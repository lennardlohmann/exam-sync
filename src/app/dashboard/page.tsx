import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MessageSquare, FileText, Settings, User } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/auth/login');
  }

  const features = [
    {
      title: 'AI Chat',
      description: 'Chat with your AI assistant',
      icon: MessageSquare,
      href: '/chat',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Documents',
      description: 'Manage your documents and PDFs',
      icon: FileText,
      href: '/documents',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'Profile',
      description: 'View and edit your profile',
      icon: User,
      href: '/profile',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Settings',
      description: 'Configure your preferences',
      icon: Settings,
      href: '/settings',
      color: 'bg-gray-500 hover:bg-gray-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session.user.email}!
            </h1>
            <p className="mt-2 text-gray-600">
              What would you like to do today?
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} href={feature.href}>
                  <div className="cursor-pointer rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                    <div
                      className={`inline-flex rounded-lg p-3 text-white ${feature.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
              <p className="mt-2 text-sm text-gray-600">No recent activity</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
              <p className="mt-2 text-sm text-gray-600">0 documents uploaded</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900">
                Chat Sessions
              </h3>
              <p className="mt-2 text-sm text-gray-600">0 conversations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
