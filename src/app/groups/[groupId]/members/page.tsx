import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import CopyJoinIdButton from '@/components/CopyJoinIdButton';

interface PageProps {
  params: Promise<{
    groupId: string;
  }>;
}

export default async function GroupMembersPage({ params }: PageProps) {
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

  // Get all members of the group
  const allMemberships = await prisma.groupMembership.findMany({
    where: {
      group_id: groupId,
    },
    orderBy: {
      joinedAt: 'asc',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {group.name}
                </h1>
                <p className="text-gray-600">Group Members</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-blue-600">
                {allMemberships.length}
              </p>
            </div>
          </div>

          {/* Join ID Section */}
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-1 text-lg font-semibold text-blue-900">
                  Invite Others
                </h3>
                <p className="text-sm text-blue-700">
                  Share this Join ID with others to invite them to the group
                </p>
              </div>
              <div className="flex items-center gap-2">
                <code className="rounded border bg-white px-3 py-2 font-mono text-sm">
                  {group.joinId}
                </code>
                <CopyJoinIdButton joinId={group.joinId} />
              </div>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Members</h2>

            <div className="grid gap-4">
              {allMemberships.map((membership, index) => (
                <div
                  key={membership.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition hover:bg-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {membership.user_id}
                      </p>
                      <p className="text-sm text-gray-600">
                        Member since{' '}
                        {new Date(membership.joinedAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                        Founder
                      </span>
                    )}
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {allMemberships.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <UserGroupIcon className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                <p>No members found in this group.</p>
              </div>
            )}
          </div>

          {/* Group Actions */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex gap-4">
              <a
                href={`/groups/${groupId}`}
                className="rounded bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700"
              >
                ← Back to Group
              </a>
              <a
                href={`/groups/${groupId}/chat`}
                className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                Group Chat
              </a>
              <a
                href={`/groups/${groupId}/journal`}
                className="rounded bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
              >
                Group Journal
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
