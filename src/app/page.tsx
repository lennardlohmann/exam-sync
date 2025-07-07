'use client';

import Link from 'next/link';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/20/solid';
import { buttonVariants } from '@/components/ui/button';
import { Target, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
          {/* Simple Hero */}
          <div className="mb-16 text-center">
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
              Track your exam preparation confidence. Study solo or sync with
              groups.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className={buttonVariants({
                  size: 'lg',
                  className: 'bg-blue-600 text-white hover:bg-blue-700',
                })}
              >
                Start Tracking
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/auth/login"
                className={buttonVariants({
                  variant: 'outline',
                  size: 'lg',
                })}
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <PlusIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  1. Create Exams
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Add your exams and break them into topics you need to study
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  2. Rate Confidence
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Rate your confidence 0-100% for each topic as you study
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                  <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  3. Track Progress
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Watch your progress cards change from red to green
                </p>
              </div>
            </div>
          </div>

          {/* Visual Example */}
          <div className="mb-16 text-center">
            <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
              Visual Progress Tracking
            </h2>
            <div className="mx-auto max-w-md rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                Calculus Final
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Derivatives
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-2 w-14 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      85%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Integrals
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-2 w-10 rounded-full bg-yellow-500"></div>
                    </div>
                    <span className="text-sm font-medium text-yellow-600">
                      60%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Series
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-2 w-4 rounded-full bg-red-500"></div>
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      25%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Simple CTA */}
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Ready to organize your exam prep?
            </h2>
            <Link
              href="/auth/signup"
              className={buttonVariants({
                size: 'lg',
                className: 'bg-blue-600 text-white hover:bg-blue-700',
              })}
            >
              Start Now - It's Free
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
