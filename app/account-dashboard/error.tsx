'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">
          Something went wrong!
        </h2>

        <button
          onClick={() => reset()}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}