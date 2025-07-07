'use client';
import { useState, useEffect } from 'react';
import {
  ChevronDownIcon,
  PlusIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Group {
  id: string;
  name: string;
  joinId: string;
  createdAt: string;
}

interface GroupSelectorProps {
  currentGroup: Group | null;
  onGroupChange: (group: Group | null) => void;
}

export default function GroupSelector({
  currentGroup,
  onGroupChange,
}: GroupSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [joinId, setJoinId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    try {
      const res = await fetch('/api/groups');
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
      }
    } catch {
      console.error('Failed to fetch groups:');
    }
  }

  async function createGroup() {
    if (!newGroupName.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGroupName }),
      });

      if (res.ok) {
        const group = await res.json();
        setGroups([...groups, group]);
        setNewGroupName('');
        setShowCreateForm(false);
        toast.success('Group created successfully!');
      } else {
        toast.error('Failed to create group');
      }
    } catch {
      toast.error('Failed to create group');
    } finally {
      setLoading(false);
    }
  }

  async function joinGroup() {
    if (!joinId.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/groups/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joinId }),
      });

      if (res.ok) {
        await fetchGroups();
        setJoinId('');
        setShowJoinForm(false);
        toast.success('Successfully joined group!');
      } else {
        toast.error('Failed to join group');
      }
    } catch {
      toast.error('Failed to join group');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 rounded px-3 py-2 text-left transition hover:bg-gray-100"
      >
        <UserGroupIcon className="h-5 w-5 text-gray-500" />
        <span className="font-medium text-gray-900">
          {currentGroup ? currentGroup.name : 'Personal'}
        </span>
        <ChevronDownIcon className="ml-auto h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {/* Personal option */}
          <button
            onClick={() => {
              onGroupChange(null);
              setIsOpen(false);
              router.push('/dashboard');
            }}
            className={`w-full px-3 py-2 text-left transition hover:bg-gray-50 ${
              !currentGroup ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            Personal
          </button>

          {/* Groups */}
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => {
                onGroupChange(group);
                setIsOpen(false);
                router.push(`/groups/${group.id}`);
              }}
              className={`w-full px-3 py-2 text-left transition hover:bg-gray-50 ${
                currentGroup?.id === group.id ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              {group.name}
            </button>
          ))}

          <div className="border-t border-gray-200 p-2">
            {!showCreateForm && !showJoinForm && (
              <>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm text-gray-600 hover:bg-gray-50"
                >
                  <PlusIcon className="h-4 w-4" />
                  Create Group
                </button>
                <button
                  onClick={() => setShowJoinForm(true)}
                  className="mt-1 flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm text-gray-600 hover:bg-gray-50"
                >
                  <UserGroupIcon className="h-4 w-4" />
                  Join Group
                </button>
              </>
            )}

            {showCreateForm && (
              <div className="space-y-2">
                <Input
                  placeholder="Group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && createGroup()}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={createGroup} disabled={loading}>
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {showJoinForm && (
              <div className="space-y-2">
                <Input
                  placeholder="Join ID"
                  value={joinId}
                  onChange={(e) => setJoinId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && joinGroup()}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={joinGroup} disabled={loading}>
                    Join
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowJoinForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
