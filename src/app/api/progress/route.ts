import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topicId, confidence, anonymous } = await request.json();

    if (!topicId || confidence < 0 || confidence > 100) {
      return NextResponse.json(
        {
          error: 'Topic ID and valid confidence (0-100) are required',
        },
        { status: 400 }
      );
    }

    // Check if topic exists and user has access
    const topic = await prisma.examTopic.findFirst({
      where: {
        id: topicId,
        exam: {
          user_id: user.id,
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 });
    }

    const progress = await prisma.examProgress.upsert({
      where: {
        user_id_topic_id: {
          user_id: user.id,
          topic_id: topicId,
        },
      },
      update: {
        confidence,
        anonymous: anonymous || false,
        lastUpdated: new Date(),
      },
      create: {
        user_id: user.id,
        topic_id: topicId,
        confidence,
        anonymous: anonymous || false,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('examId');
    const groupId = searchParams.get('groupId');

    if (!examId) {
      return NextResponse.json(
        { error: 'Exam ID is required' },
        { status: 400 }
      );
    }

    // Get progress for all topics in the exam
    const progress = await prisma.examProgress.findMany({
      where: {
        topic: {
          exam_id: examId,
          exam: {
            ...(groupId ? { group_id: groupId } : { user_id: user.id }),
          },
        },
      },
      include: {
        topic: {
          include: {
            exam: true,
          },
        },
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
