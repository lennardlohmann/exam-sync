'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Target, Users } from 'lucide-react';

interface ExamProgress {
  id: string;
  confidence: number;
  anonymous: boolean;
  lastUpdated: string;
}

interface ExamTopic {
  id: string;
  title: string;
  description?: string;
  progress: ExamProgress[];
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

export default function ExamDetailPage() {
  const { examId } = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (examId) {
      fetchExam();
    }
  }, [examId]);

  const fetchExam = async () => {
    try {
      const response = await fetch(`/api/exams?examId=${examId}`);
      if (response.ok) {
        const data = await response.json();
        setExam(data[0]); // Get first exam from array
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const addTopic = async () => {
    if (!newTopicTitle.trim()) return;

    setAdding(true);
    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTopicTitle.trim(),
          description: newTopicDescription.trim() || null,
          examId: examId,
        }),
      });

      if (response.ok) {
        const newTopic = await response.json();
        setExam((prev) =>
          prev
            ? {
                ...prev,
                topics: [...prev.topics, newTopic],
              }
            : null
        );
        setNewTopicTitle('');
        setNewTopicDescription('');
        setShowAddTopic(false);
      }
    } catch (error) {
      console.error('Error adding topic:', error);
    } finally {
      setAdding(false);
    }
  };

  const updateConfidence = async (topicId: string, confidence: number) => {
    try {
      const response = await fetch('/api/progress', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId,
          confidence,
        }),
      });

      if (response.ok) {
        const updatedProgress = await response.json();
        setExam((prev) =>
          prev
            ? {
                ...prev,
                topics: prev.topics.map((topic) =>
                  topic.id === topicId
                    ? { ...topic, progress: [updatedProgress] }
                    : topic
                ),
              }
            : null
        );
      }
    } catch (error) {
      console.error('Error updating confidence:', error);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence < 30) return 'bg-red-500';
    if (confidence < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getAverageConfidence = () => {
    if (!exam || exam.topics.length === 0) return 0;
    const total = exam.topics.reduce((sum, topic) => {
      const userProgress = topic.progress[0];
      return sum + (userProgress?.confidence || 0);
    }, 0);
    return Math.round(total / exam.topics.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl">
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Loading exam...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl">
          <div className="py-12 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Exam not found
            </h1>
            <Button onClick={() => router.push('/dashboard')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const averageConfidence = getAverageConfidence();

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {exam.title}
              </h1>
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
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {averageConfidence}%
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Average Confidence
              </p>
            </div>
          </div>
        </div>

        {/* Add Topic Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddTopic(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Topic
          </Button>
        </div>

        {/* Add Topic Form */}
        {showAddTopic && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Add New Topic
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="topicTitle">Topic Title</Label>
                <Input
                  id="topicTitle"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="e.g., Linear Algebra, Organic Chemistry"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="topicDescription">Description (Optional)</Label>
                <Input
                  id="topicDescription"
                  value={newTopicDescription}
                  onChange={(e) => setNewTopicDescription(e.target.value)}
                  placeholder="Brief description of the topic"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={addTopic}
                  disabled={!newTopicTitle.trim() || adding}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {adding ? 'Adding...' : 'Add Topic'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddTopic(false);
                    setNewTopicTitle('');
                    setNewTopicDescription('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Topics Grid */}
        {exam.topics.length === 0 ? (
          <div className="rounded-lg bg-white py-12 text-center dark:bg-gray-800">
            <Target className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No topics yet
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Add your first topic to start tracking your confidence.
            </p>
            <Button
              onClick={() => setShowAddTopic(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Topic
            </Button>
          </div>
        ) : (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            }}
          >
            {exam.topics.map((topic) => {
              const userProgress = topic.progress[0];
              const confidence = userProgress?.confidence || 0;

              return (
                <div
                  key={topic.id}
                  className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {topic.title}
                    </h3>
                    {topic.description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {topic.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Confidence
                        </span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {confidence}%
                        </span>
                      </div>

                      <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className={`h-3 rounded-full transition-all ${getConfidenceColor(confidence)}`}
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-3 block text-sm">
                        Update Confidence
                      </Label>

                      {/* Quick Confidence Buttons */}
                      <div className="mb-3 grid grid-cols-5 gap-1.5">
                        {[0, 25, 50, 75, 100].map((value) => (
                          <button
                            key={value}
                            onClick={() => updateConfidence(topic.id, value)}
                            className={`min-w-0 rounded-md px-2 py-2 text-xs font-medium transition-colors ${
                              confidence === value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {value}%
                          </button>
                        ))}
                      </div>

                      {/* Custom Input */}
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={confidence}
                          onChange={(e) => {
                            const value = Math.min(
                              100,
                              Math.max(0, parseInt(e.target.value) || 0)
                            );
                            updateConfidence(topic.id, value);
                          }}
                          className="flex-1 text-center"
                          placeholder="0-100"
                        />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
