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
    console.error('Error:', error);
  }, [error]);

  return (
    <div style={{
      padding: '40px 20px',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center',
      fontFamily: 'Courier Prime, monospace'
    }}>
      <h2 style={{
        fontSize: '24px',
        marginBottom: '20px'
      }}>
        Error loading category
      </h2>
      <button
        onClick={reset}
        style={{
          background: 'none',
          border: '1px solid black',
          padding: '8px 16px',
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: 'Courier Prime, monospace'
        }}
      >
        Try again
      </button>
    </div>
  );
}
