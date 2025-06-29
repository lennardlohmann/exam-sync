import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ChatInterface } from '@/components/ChatInterface';

export default async function ChatPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="border-b border-gray-200 px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                AI Chat Assistant
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Chat with your AI assistant
              </p>
            </div>

            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
}
