import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import GroupChat from '@/components/GroupChat';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{
    groupId: string;
  }>;
}

export default async function GroupChatPage({ params }: PageProps) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return redirect('/auth/login');
  }

  const userId = session.user.id;
  const { groupId } = await params;

  // Check if user is a member of this group
  const membership = await prisma.groupMembership.findFirst({
    where: {
      user_id: userId,
      group_id: groupId,
    },
    include: {
      group: true,
    },
  });

  if (!membership) {
    return redirect('/dashboard');
  }

  const group = membership.group;

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {group.name}
              </h1>
              <p className="text-sm text-gray-600">Group Chat</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={`/groups/${groupId}`}
              className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-200"
            >
              Group Home
            </a>
            <a
              href={`/groups/${groupId}/members`}
              className="rounded bg-gray-100 px-3 py-1 text-sm text-gray-700 transition hover:bg-gray-200"
            >
              Members
            </a>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <GroupChat groupId={groupId} currentUserId={userId} />
      </div>
    </div>
  );
}
