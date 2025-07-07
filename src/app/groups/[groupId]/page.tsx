'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Users,
  BookOpen,
  Target,
  ChevronRight,
  User,
  TrendingUp,
} from 'lucide-react';
import CopyJoinIdButton from '@/components/CopyJoinIdButton';

interface Topic {
  id: string;
  title: string;
  description?: string;
  confidence: number;
}

interface Exam {
  id: string;
  title: string;
  isGroupExam: boolean;
  topicCount: number;
  averageConfidence: number;
  topics: Topic[];
}

interface GroupMember {
  userId: string;
  joinedAt: string;
  exams: Exam[];
  totalExams: number;
  averageConfidence: number;
}

interface Group {
  id: string;
  name: string;
  joinId: string;
}

export default function GroupPage() {
  const { groupId } = useParams();
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(
    null
  );
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [userEmails, setUserEmails] = useState<{ [userId: string]: string }>(
    {}
  );

  useEffect(() => {
    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      // Fetch group info
      const groupResponse = await fetch(`/api/groups/${groupId}`);
      if (!groupResponse.ok) {
        router.push('/dashboard');
        return;
      }
      const groupData = await groupResponse.json();
      setGroup(groupData);

      // Fetch members with their exams
      const membersResponse = await fetch(`/api/groups/${groupId}/members`);
      if (membersResponse.ok) {
        const membersData = await membersResponse.json();
        setMembers(membersData);

        // Fetch user emails for display names
        const emails: { [userId: string]: string } = {};

        for (const member of membersData) {
          // This would need to be done server-side in a real app
          // For now, we'll show user IDs or implement a user lookup API
          emails[member.userId] = `User ${member.userId.slice(0, 8)}`;
        }
        setUserEmails(emails);
      }
    } catch (error) {
      console.error('Error fetching group data:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence < 30) return 'bg-red-500';
    if (confidence < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getConfidenceTextColor = (confidence: number) => {
    if (confidence < 30) return 'text-red-600';
    if (confidence < 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Loading group...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          <div className="py-12 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Group not found
            </h1>
            <Button onClick={() => router.push('/dashboard')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show individual exam details
  if (selectedExam && selectedMember) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl">
          <Button
            variant="outline"
            onClick={() => setSelectedExam(null)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {userEmails[selectedMember.userId]}'s Exams
          </Button>

          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedExam.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {userEmails[selectedMember.userId]}'s exam
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedExam.averageConfidence}%
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Average Confidence
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {selectedExam.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700"
                >
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    {topic.title}
                  </h3>
                  {topic.description && (
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                      {topic.description}
                    </p>
                  )}

                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confidence
                    </span>
                    <span
                      className={`text-lg font-bold ${getConfidenceTextColor(topic.confidence)}`}
                    >
                      {topic.confidence}%
                    </span>
                  </div>

                  <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-600">
                    <div
                      className={`h-3 rounded-full transition-all ${getConfidenceColor(topic.confidence)}`}
                      style={{ width: `${topic.confidence}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {selectedExam.topics.length === 0 && (
              <div className="py-8 text-center">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  No topics yet
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  This exam doesn't have any topics added yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show individual member's exams
  if (selectedMember) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="mx-auto max-w-6xl">
          <Button
            variant="outline"
            onClick={() => setSelectedMember(null)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Group Members
          </Button>

          <div className="mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userEmails[selectedMember.userId]}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedMember.totalExams} exams • Joined{' '}
                    {new Date(selectedMember.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedMember.averageConfidence}%
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Overall Confidence
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {selectedMember.exams.map((exam) => (
              <div
                key={exam.id}
                onClick={() => setSelectedExam(exam)}
                className="cursor-pointer rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {exam.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{exam.topicCount} topics</span>
                      {exam.isGroupExam && (
                        <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                          Group Exam
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Average Confidence
                  </span>
                  <span
                    className={`text-lg font-bold ${getConfidenceTextColor(exam.averageConfidence)}`}
                  >
                    {exam.averageConfidence}%
                  </span>
                </div>

                <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-2 rounded-full transition-all ${getConfidenceColor(exam.averageConfidence)}`}
                    style={{ width: `${exam.averageConfidence}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {selectedMember.exams.length === 0 && (
            <div className="rounded-lg bg-white py-12 text-center dark:bg-gray-800">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No exams yet
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                This user hasn't created any exams yet.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show group members overview
  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Group Header */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {group.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {members.length} members • ID: {group.id}
                </p>
              </div>
            </div>
            <CopyJoinIdButton joinId={group.joinId} />
          </div>
        </div>

        {/* Group Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="flex items-center">
              <Users className="mr-4 h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {members.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="flex items-center">
              <BookOpen className="mr-4 h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Exams
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {members.reduce((sum, member) => sum + member.totalExams, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="flex items-center">
              <TrendingUp className="mr-4 h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg. Confidence
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {members.length > 0
                    ? Math.round(
                        members.reduce(
                          (sum, member) => sum + member.averageConfidence,
                          0
                        ) / members.length
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div
              key={member.userId}
              onClick={() => setSelectedMember(member)}
              className="cursor-pointer rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {userEmails[member.userId] || 'Loading...'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {member.totalExams} exams
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Overall Confidence
                  </span>
                  <span
                    className={`text-lg font-bold ${getConfidenceTextColor(member.averageConfidence)}`}
                  >
                    {member.averageConfidence}%
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-2 rounded-full transition-all ${getConfidenceColor(member.averageConfidence)}`}
                    style={{ width: `${member.averageConfidence}%` }}
                  />
                </div>

                {/* Show preview of member's exams */}
                <div className="mt-4 space-y-2">
                  {member.exams.slice(0, 2).map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate text-gray-600 dark:text-gray-400">
                        {exam.title}
                      </span>
                      <span
                        className={`font-medium ${getConfidenceTextColor(exam.averageConfidence)}`}
                      >
                        {exam.averageConfidence}%
                      </span>
                    </div>
                  ))}
                  {member.exams.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{member.exams.length - 2} more exams
                    </div>
                  )}
                  {member.exams.length === 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      No exams yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="rounded-lg bg-white py-12 text-center dark:bg-gray-800">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No members yet
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Share the group invite link to add members.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
