import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = user.id;
  const { joinId } = await request.json();

  if (!joinId || joinId.trim().length === 0) {
    return NextResponse.json({ error: 'Join ID is required' }, { status: 400 });
  }

  // Find group by joinId
  const group = await prisma.group.findUnique({
    where: { joinId: joinId.trim() },
  });

  if (!group) {
    return NextResponse.json({ error: 'Invalid join ID' }, { status: 404 });
  }

  // Check if user is already a member
  const existingMembership = await prisma.groupMembership.findFirst({
    where: {
      user_id: userId,
      group_id: group.id,
    },
  });

  if (existingMembership) {
    return NextResponse.json(
      { error: 'You are already a member of this group' },
      { status: 400 }
    );
  }

  // Add user to group
  await prisma.groupMembership.create({
    data: {
      user_id: userId,
      group_id: group.id,
    },
  });

  return NextResponse.json({ message: 'Successfully joined group', group });
}
