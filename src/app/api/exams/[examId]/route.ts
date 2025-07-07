import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
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

    const { title } = await request.json();
    const { examId } = await params;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Check if user owns this exam
    const existingExam = await prisma.exam.findFirst({
      where: {
        id: examId,
        user_id: user.id,
      },
    });

    if (!existingExam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    const exam = await prisma.exam.update({
      where: { id: examId },
      data: {
        title: title.trim(),
      },
      include: {
        topics: {
          include: {
            progress: {
              where: {
                user_id: user.id,
              },
            },
          },
        },
        group: true,
      },
    });

    return NextResponse.json(exam);
  } catch (error) {
    console.error('Error updating exam:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
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

    const { examId } = await params;

    // Check if user owns this exam
    const existingExam = await prisma.exam.findFirst({
      where: {
        id: examId,
        user_id: user.id,
      },
    });

    if (!existingExam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    await prisma.exam.delete({
      where: { id: examId },
    });

    return NextResponse.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
