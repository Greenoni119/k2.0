'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';

const PublicLayout = dynamic(() => import('@/components/PublicLayout'), {
  ssr: false
});

export default function About() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center min-h-screen">
      <h1 style={{ 
        fontFamily: 'Courier Prime, monospace',
        fontSize: '24px',
        marginBottom: '24px',
        marginTop: '48px'
      }}>
        Our Story
      </h1>
      
      <p style={{ 
        fontFamily: 'Courier Prime, monospace',
        fontSize: '16px',
        maxWidth: '800px',
        textAlign: 'center',
        marginBottom: '24px',
        lineHeight: '1.5'
      }}>
        K2 is more than just a store - it&apos;s a curated journey through unique items
        that transform houses into homes. Founded with a passion for discovering
        exceptional pieces that tell stories, we believe that every object has the
        power to make spaces feel special.
      </p>

      <div style={{ 
        width: '100%',
        maxWidth: '1000px',
        padding: '0 48px',
        marginBottom: '64px'
      }}>
        <Image
          src="/living.png"
          alt="Modern interior with natural light"
          width={1200}
          height={675}
          style={{
            width: '100%',
            height: 'auto'
          }}
          priority
        />
      </div>

      <h2 style={{ 
        fontFamily: 'Courier Prime, monospace',
        fontSize: '24px',
        marginBottom: '24px'
      }}>
        Our Philosophy
      </h2>
      
      <p style={{ 
        fontFamily: 'Courier Prime, monospace',
        fontSize: '16px',
        maxWidth: '800px',
        textAlign: 'center',
        marginBottom: '48px',
        lineHeight: '1.5'
      }}>
        We carefully select each piece in our collection, focusing on quality,
        uniqueness, and the ability to bring character to your space. From
        handcrafted objects to carefully chosen women&apos;s accessories, every item is
        chosen with intention.
      </p>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '48px',
        maxWidth: '1000px',
        width: '100%',
        padding: '0 48px',
        marginBottom: '64px',
        textAlign: 'center'
      }}>
        <div>
          <h3 style={{ 
            fontFamily: 'Courier Prime, monospace',
            fontSize: '16px',
            marginBottom: '12px'
          }}>
            Curated Selection
          </h3>
          <p style={{ 
            fontFamily: 'Courier Prime, monospace',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            Each piece is personally selected to ensure quality and uniqueness.
          </p>
        </div>

        <div>
          <h3 style={{ 
            fontFamily: 'Courier Prime, monospace',
            fontSize: '16px',
            marginBottom: '12px'
          }}>
            Thoughtful Design
          </h3>
          <p style={{ 
            fontFamily: 'Courier Prime, monospace',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            We believe in the power of design to transform everyday living.
          </p>
        </div>

        <div>
          <h3 style={{ 
            fontFamily: 'Courier Prime, monospace',
            fontSize: '16px',
            marginBottom: '12px'
          }}>
            Quality First
          </h3>
          <p style={{ 
            fontFamily: 'Courier Prime, monospace',
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            Every item meets our high standards for craftsmanship and durability.
          </p>
        </div>
      </div>
    </div>
    </PublicLayout>
  );
}
