'use client';

import MaxWidthWrapper from '../components/max-width-wrapper';
import Link from 'next/link';
import { ArrowRightCircleIcon } from '@heroicons/react/16/solid';
import { ThemeSwitch } from '@/components/theme-switch';
import { buttonVariants } from '@/components/ui/button';
import { useState } from 'react';
import { useEffect } from 'react';

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <MouseTracker />
        <MaxWidthWrapper className="mb-12 flex max-w-prose flex-col items-center justify-center">
          <div className="bg-background focus-indicator mt-28 rounded-full border p-4 shadow-lg backdrop-blur-sm sm:mt-15">
            <p className="text-foreground text-xl font-medium">
              The app is up and running!
            </p>
          </div>
          <h1 className="mt-10 max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
            Chat with your <span className="text-blue-600">documents</span> in
            seconds.
          </h1>
          <p className="mt-5">
            Quill allows you to have conversations with any PDF document. Simply
            upload your file and ask any questions that come up.
          </p>
        </MaxWidthWrapper>

        {/* value proposition section */}
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-80 -z-10 transform-gpu overflow-hidden blur-3xl"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-purple-500/30 to-pink-500/30 opacity-100 blur-3xl sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            ></div>
          </div>

          <div className="mx-auto mt-8 flex items-center justify-center">
            <Link
              href="/dashboard"
              className={buttonVariants({
                className: 'text-primary-50 bg-blue-600',
              })}
            >
              Get Started <ArrowRightCircleIcon className="ml-2 h-5 w-5" />
            </Link>
            <ThemeSwitch className="m-4" />
          </div>
        </div>
      </div>
    </>
  );
}

const MouseTracker = () => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [delayedPosition, setDelayedPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  useEffect(() => {
    const delay = 12; // 100ms delay
    const timer = setTimeout(() => {
      setDelayedPosition(mousePosition);
    }, delay);

    return () => clearTimeout(timer);
  }, [mousePosition]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-1]"
      style={{
        background: `radial-gradient(100px at ${delayedPosition.x}px ${delayedPosition.y}px, rgba(244, 114, 182, 0.15), transparent 50%)`,
      }}
    />
  );
};
