import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { groupId } = await params;

    // Check if user is a member of this group
    const membership = await prisma.groupMembership.findFirst({
      where: {
        user_id: user.id,
        group_id: groupId,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Not a member of this group' },
        { status: 403 }
      );
    }

    // Get all members of the group with their exams
    const groupMembers = await prisma.groupMembership.findMany({
      where: {
        group_id: groupId,
      },
    });

    // For each member, get their exams with confidence data
    const membersWithExams = await Promise.all(
      groupMembers.map(async (member) => {
        // Get member's exams (both personal and group exams)
        const exams = await prisma.exam.findMany({
          where: {
            user_id: member.user_id,
            OR: [
              { group_id: groupId }, // Group exams
              { group_id: null }, // Personal exams
            ],
          },
          include: {
            topics: {
              include: {
                progress: {
                  where: {
                    user_id: member.user_id,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        // Calculate overall confidence for this member
        const totalTopics = exams.reduce(
          (sum: number, exam) => sum + exam.topics.length,
          0
        );
        const totalConfidence = exams.reduce((sum: number, exam) => {
          return (
            sum +
            exam.topics.reduce((examSum: number, topic) => {
              const userProgress = topic.progress[0];
              return examSum + (userProgress?.confidence || 0);
            }, 0)
          );
        }, 0);

        const averageConfidence =
          totalTopics > 0 ? Math.round(totalConfidence / totalTopics) : 0;

        return {
          userId: member.user_id,
          joinedAt: member.joinedAt,
          exams: exams.map((exam) => ({
            id: exam.id,
            title: exam.title,
            isGroupExam: exam.group_id === groupId,
            topicCount: exam.topics.length,
            averageConfidence:
              exam.topics.length > 0
                ? Math.round(
                    exam.topics.reduce((sum, topic) => {
                      const userProgress = topic.progress[0];
                      return sum + (userProgress?.confidence || 0);
                    }, 0) / exam.topics.length
                  )
                : 0,
            topics: exam.topics.map((topic) => ({
              id: topic.id,
              title: topic.title,
              description: topic.description,
              confidence: topic.progress[0]?.confidence || 0,
            })),
          })),
          totalExams: exams.length,
          averageConfidence,
        };
      })
    );

    return NextResponse.json(membersWithExams);
  } catch (error) {
    console.error('Error fetching group members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
