import MaxWidthWrapper from './max-width-wrapper';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { ArrowRightCircleIcon } from '@heroicons/react/16/solid';

const Navbar = () => {
  return (
    <nav className="sticky inset-x-0 top-0 z-30 h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="z-40 flex font-semibold">
            <span>Quill.</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/sign-in" className="text-gray-700 hover:text-gray-900">
              Sign in
            </Link>
            <Link
              href="/auth/login"
              className={buttonVariants({
                variant: 'default',
                className: 'bg-gray-900 text-white hover:bg-gray-800',
              })}
            >
              Get Started <ArrowRightCircleIcon className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
