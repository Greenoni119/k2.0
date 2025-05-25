'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoryClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/categories/${encodeURIComponent(slug)}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/');
            return;
          }
          const data = await response.json();
          setError(data.error || 'Failed to load data');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug, router]);

  if (loading) {
    return (
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <p style={{
          fontFamily: 'Courier Prime, monospace',
          fontSize: '16px'
        }}>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <p style={{
          fontFamily: 'Courier Prime, monospace',
          fontSize: '16px',
          color: 'red'
        }}>{error}</p>
      </main>
    );
  }

  return (
    <main style={{ 
      maxWidth: '1200px', 
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{
        fontFamily: 'Courier Prime, monospace',
        fontSize: '36px',
        marginBottom: '40px',
        textTransform: 'lowercase'
      }}>
        {decodeURIComponent(slug)}
      </h1>
    </main>
  );
}
