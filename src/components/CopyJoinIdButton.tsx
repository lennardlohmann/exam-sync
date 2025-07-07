'use client';

import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface CopyJoinIdButtonProps {
  joinId: string;
}

export default function CopyJoinIdButton({ joinId }: CopyJoinIdButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinId);
    } catch (err) {
      console.error('Failed to copy join ID', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded bg-blue-600 p-2 text-white transition hover:bg-blue-700"
      title="Copy Join ID"
      type="button"
    >
      <ClipboardDocumentIcon className="h-4 w-4" />
    </button>
  );
}
