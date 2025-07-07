'use client';

import MaxWidthWrapper from './max-width-wrapper';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '@/components/mode-toggle';

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

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

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all dark:border-gray-700 dark:bg-gray-900/75">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-700">
          <Link href="/" className="z-40 flex text-xl font-semibold">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Exam-Sync
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {!loading && user && (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Dashboard
                </Link>
              </>
            )}

            {!loading && (
              <>
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className={buttonVariants({
                        size: 'sm',
                        className: 'bg-blue-600 text-white hover:bg-blue-700',
                      })}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Theme Toggle - Only show on landing page */}
            {pathname === '/' && <ModeToggle />}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
