'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, Users, TrendingUp, Target } from 'lucide-react';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
  };
}

interface ExamTopic {
  id: string;
  title: string;
  description?: string;
  progress: {
    confidence: number;
  }[];
}

interface Exam {
  id: string;
  title: string;
  topics: ExamTopic[];
  group?: {
    id: string;
    name: string;
  };
}

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExamTitle, setNewExamTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const getDisplayName = () => {
    const firstName = user.user_metadata?.first_name;
    const lastName = user.user_metadata?.last_name;

    if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    }

    // Extract first part of email if no name metadata and email exists
    if (user.email) {
      return user.email.split('@')[0];
    }

    // Fallback if no email or name
    return 'User';
  };

  useEffect(() => {
    fetchExams();

    // Listen for the custom event from sidebar
    const handleShowCreateExam = () => {
      setShowCreateForm(true);
    };

    window.addEventListener('showCreateExam', handleShowCreateExam);

    return () => {
      window.removeEventListener('showCreateExam', handleShowCreateExam);
    };
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch('/api/exams');
      if (response.ok) {
        const data = await response.json();
        setExams(data);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const createExam = async () => {
    if (!newExamTitle.trim()) return;

    setCreating(true);
    try {
      const response = await fetch('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newExamTitle.trim(),
        }),
      });

      if (response.ok) {
        const newExam = await response.json();
        setExams([newExam, ...exams]);
        setNewExamTitle('');
        setShowCreateForm(false);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Unknown error' }));
        console.error('Failed to create exam:', response.status, errorData);
        alert(`Failed to create exam: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating exam:', error);
    } finally {
      setCreating(false);
    }
  };

  const getExamProgress = (exam: Exam) => {
    if (exam.topics.length === 0) return 0;

    const totalConfidence = exam.topics.reduce((sum, topic) => {
      const userProgress = topic.progress[0]; // Get user's progress (first entry)
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {getDisplayName()}!
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Track your exam preparation progress
                </p>
              </div>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Exam
              </Button>
            </div>
          </div>

          {/* Create Exam Form */}
          {showCreateForm && (
            <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Create New Exam
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="examTitle">Exam Title</Label>
                  <Input
                    id="examTitle"
                    value={newExamTitle}
                    onChange={(e) => setNewExamTitle(e.target.value)}
                    placeholder="e.g., Math Final, Biochemistry 2"
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={createExam}
                    disabled={!newExamTitle.trim() || creating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {creating ? 'Creating...' : 'Create Exam'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewExamTitle('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Exams
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {exams.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Topics
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {exams.reduce((sum, exam) => sum + exam.topics.length, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg. Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {exams.length > 0
                      ? Math.round(
                          exams.reduce(
                            (sum, exam) => sum + getExamProgress(exam),
                            0
                          ) / exams.length
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Exams Grid */}
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Loading exams...
              </p>
            </div>
          ) : exams.length === 0 ? (
            <div className="py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No exams yet
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Create your first exam to start tracking your preparation
                progress.
              </p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Exam
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => {
                const progress = getExamProgress(exam);
                return (
                  <Link key={exam.id} href={`/exams/${exam.id}`}>
                    <div className="cursor-pointer rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {exam.title}
                          </h3>
                          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{exam.topics.length} topics</span>
                            {exam.group && (
                              <div className="flex items-center">
                                <Users className="mr-1 h-3 w-3" />
                                {exam.group.name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {progress}%
                          </div>
                          <div className="mt-1 h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className={`h-2 rounded-full transition-all ${getProgressColor(progress)}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
