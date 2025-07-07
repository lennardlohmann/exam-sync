import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, examId } = await request.json();

    if (!title?.trim() || !examId) {
      return NextResponse.json(
        { error: 'Title and examId are required' },
        { status: 400 }
      );
    }

    // Check if user owns the exam
    const exam = await prisma.exam.findFirst({
      where: {
        id: examId,
        user_id: user.id,
      },
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    const topic = await prisma.examTopic.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        exam_id: examId,
      },
    });

    // Create initial progress entry for the user
    await prisma.examProgress.create({
      data: {
        user_id: user.id,
        topic_id: topic.id,
        confidence: 0,
      },
    });

    const topicWithProgress = await prisma.examTopic.findUnique({
      where: { id: topic.id },
      include: {
        progress: {
          where: {
            user_id: user.id,
          },
        },
      },
    });

    return NextResponse.json(topicWithProgress, { status: 201 });
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
