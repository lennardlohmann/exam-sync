import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = user.id;

  const memberships = await prisma.groupMembership.findMany({
    where: { user_id: userId },
    include: {
      group: true,
    },
  });

  const groups = memberships.map((membership) => membership.group);
  return NextResponse.json(groups);
}

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
  const { name } = await request.json();

  if (!name || name.trim().length === 0) {
    return NextResponse.json(
      { error: 'Group name is required' },
      { status: 400 }
    );
  }

  // Create group
  const group = await prisma.group.create({
    data: {
      name: name.trim(),
    },
  });

  // Add creator as member
  await prisma.groupMembership.create({
    data: {
      user_id: userId,
      group_id: group.id,
    },
  });

  return NextResponse.json(group);
}
