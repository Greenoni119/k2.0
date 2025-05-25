'use client';

export default function LoadingState() {
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
