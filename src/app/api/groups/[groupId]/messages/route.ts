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
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const { groupId } = await params;

    // Check if user is a member of this group
    const membership = await prisma.groupMembership.findFirst({
      where: {
        user_id: userId,
        group_id: groupId,
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // TODO: Group messages not yet implemented in schema
    // Return empty array for now to prevent errors
    const messages: Array<{
      id: string;
      content: string;
      user_id: string;
      group_id: string;
      createdAt: Date;
    }> = [];

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error in GET /api/groups/[groupId]/messages:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const { groupId } = await params;
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    // Check if user is a member of this group
    const membership = await prisma.groupMembership.findFirst({
      where: {
        user_id: userId,
        group_id: groupId,
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // TODO: Group messages not yet implemented in schema
    // Return a mock message for now to prevent errors
    const message = {
      id: 'temp-id',
      content: content.trim(),
      user_id: userId,
      group_id: groupId,
      createdAt: new Date(),
    };

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error in POST /api/groups/[groupId]/messages:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
