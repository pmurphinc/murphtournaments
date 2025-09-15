'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Schedule Page Error:', error);
  }, [error]);

  return (
    <div className="p-8 text-red-500">
      <h2 className="text-2xl font-bold">Something went wrong 😢</h2>
      <p>{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
}
