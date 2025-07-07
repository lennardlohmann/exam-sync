'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  BookOpenIcon,
  PlusIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronRightIcon as ChevronRightSmallIcon,
} from '@heroicons/react/24/outline';
import GroupSelector from '@/components/GroupSelector';
import { ThemeSwitch } from '@/components/theme-switch';

interface ExamProgress {
  confidence: number;
}

interface ExamTopic {
  progress?: ExamProgress[];
}

interface Exam {
  id: string;
  title: string;
  description?: string;
  topics: ExamTopic[];
  group?: {
    id: string;
    name: string;
  };
}

const navLinks = [{ href: '/dashboard', label: 'Dashboard', icon: HomeIcon }];

export default function Sidebar({
  className,
  expanded,
  setExpanded,
}: {
  className?: string;
  expanded: boolean;
  setExpanded: (v: boolean) => void;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentGroup, setCurrentGroup] = useState<{
    id: string;
    name: string;
    joinId: string;
    createdAt: string;
  } | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [showExams, setShowExams] = useState(false);
  const [loadingExams, setLoadingExams] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const fetchExams = async () => {
    if (!user) return;

    setLoadingExams(true);
    try {
      const groupParam = currentGroup ? `?groupId=${currentGroup.id}` : '';
      const response = await fetch(`/api/exams${groupParam}`);
      if (response.ok) {
        const data = await response.json();
        setExams(data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleMyExamsClick = async () => {
    if (!showExams) {
      await fetchExams();
    }
    setShowExams(!showExams);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/auth/login';
  };

  const handleSignIn = () => {
    window.location.href = '/auth/login';
  };

  const handleSignUp = () => {
    window.location.href = '/auth/signup';
  };

  const getExamProgress = (exam: Exam) => {
    if (exam.topics.length === 0) return 0;

    const totalConfidence = exam.topics.reduce((sum, topic) => {
      const userProgress = topic.progress?.[0]; // Get user's progress (first entry)
      return sum + (userProgress?.confidence || 0);
    }, 0);

    return Math.round(totalConfidence / exam.topics.length);
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div
      className={cn(
        'fixed top-0 left-0 z-40 h-screen border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-900',
        expanded ? 'w-64' : 'w-16',
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          {expanded && (
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Exam-Sync
            </h1>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {expanded ? (
              <ChevronLeftIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          {/* Group Selector */}
          {expanded && user && (
            <div className="mb-6">
              <GroupSelector
                currentGroup={currentGroup}
                onGroupChange={(group) => {
                  setCurrentGroup(group);
                  // Refresh exams when group changes
                  if (showExams) {
                    fetchExams();
                  }
                }}
              />
            </div>
          )}

          <ul className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => {
                      // Reset to Personal when going to Dashboard
                      if (link.href === '/dashboard') {
                        setCurrentGroup(null);
                      }
                    }}
                    className={`flex items-center rounded-lg py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white ${
                      expanded ? 'px-3' : 'justify-center'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {expanded && <span className="ml-3">{link.label}</span>}
                  </Link>
                </li>
              );
            })}

            {/* My Exams with dropdown */}
            <li>
              <button
                onClick={handleMyExamsClick}
                className={`flex w-full items-center rounded-lg py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white ${
                  expanded ? 'px-3' : 'justify-center'
                }`}
              >
                <BookOpenIcon className="h-5 w-5 flex-shrink-0" />
                {expanded && (
                  <>
                    <span className="ml-3">My Exams</span>
                    {showExams ? (
                      <ChevronDownIcon className="ml-auto h-4 w-4" />
                    ) : (
                      <ChevronRightSmallIcon className="ml-auto h-4 w-4" />
                    )}
                  </>
                )}
              </button>

              {/* Exams List */}
              {expanded && showExams && (
                <div className="mt-2 ml-8 space-y-1">
                  {loadingExams ? (
                    <div className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400">
                      Loading...
                    </div>
                  ) : (
                    <>
                      {/* Create Exam Button */}
                      <Link
                        href="/dashboard"
                        onClick={() => {
                          // This will trigger the create exam form in the dashboard
                          setTimeout(() => {
                            const event = new CustomEvent('showCreateExam');
                            window.dispatchEvent(event);
                          }, 100);
                        }}
                        className="flex items-center rounded-lg px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        <PlusIcon className="mr-2 h-3 w-3" />
                        Create Exam
                      </Link>

                      {/* Exam List */}
                      {exams.length > 0 ? (
                        exams.map((exam) => {
                          const progress = getExamProgress(exam);
                          return (
                            <Link
                              key={exam.id}
                              href={`/exams/${exam.id}`}
                              className="flex items-center rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="truncate font-medium">
                                  {exam.title}
                                </div>
                                <div className="mt-1 flex items-center">
                                  <div className="h-1 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                      className={`h-1 rounded-full transition-all ${getProgressColor(progress)}`}
                                      style={{ width: `${progress}%` }}
                                    />
                                  </div>
                                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                    {progress}%
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })
                      ) : (
                        <div className="px-3 py-1 text-sm text-gray-500 dark:text-gray-400">
                          No exams yet
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          ) : user ? (
            <div className="space-y-2">
              {expanded && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentGroup ? currentGroup.name : 'Personal Workspace'}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSignOut}
                  className={`flex flex-1 items-center rounded-lg py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 ${
                    expanded ? 'px-3' : 'justify-center'
                  }`}
                >
                  <ArrowLeftOnRectangleIcon className="h-4 w-4 flex-shrink-0" />
                  {expanded && <span className="ml-2">Sign Out</span>}
                </button>

                {/* Theme Toggle */}
                {expanded && <ThemeSwitch className="scale-90" />}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleSignIn}
                className={`flex w-full items-center rounded-lg py-2 text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 ${
                  expanded ? 'px-3' : 'justify-center'
                }`}
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 flex-shrink-0" />
                {expanded && <span className="ml-2">Sign In</span>}
              </button>
              <button
                onClick={handleSignUp}
                className={`flex w-full items-center rounded-lg py-2 text-sm text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 ${
                  expanded ? 'px-3' : 'justify-center'
                }`}
              >
                <UserPlusIcon className="h-4 w-4 flex-shrink-0" />
                {expanded && <span className="ml-2">Sign Up</span>}
              </button>

              {/* Theme Toggle */}
              {expanded && (
                <div className="flex justify-center pt-2">
                  <ThemeSwitch className="scale-90" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
