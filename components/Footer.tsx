'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      borderTop: '1px solid #000',
      paddingTop: '40px',
      paddingBottom: '40px',
      backgroundColor: '#fff',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px'
      }}>
        {/* About Column */}
        <div>
          <h3 style={{
            fontSize: '14px',
            marginBottom: '16px',
            fontFamily: 'var(--font-courier-prime), monospace',
            letterSpacing: '1px'
          }}>
            ABOUT K2
          </h3>
          <p style={{
            fontSize: '12px',
            lineHeight: '1.6',
            color: '#333',
            maxWidth: '300px'
          }}>
            Curating unique objects and furniture pieces that bring beauty and function to your space.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{
            fontSize: '14px',
            marginBottom: '16px',
            fontFamily: 'var(--font-courier-prime), monospace',
            letterSpacing: '1px'
          }}>
            QUICK LINKS
          </h3>
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <Link href="/about" style={{
              fontSize: '12px',
              color: '#333',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}>
              About
            </Link>
            <Link href="/women" style={{
              fontSize: '12px',
              color: '#333',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}>
              Women
            </Link>
            <Link href="/objects" style={{
              fontSize: '12px',
              color: '#333',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}>
              Objects
            </Link>
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h3 style={{
            fontSize: '14px',
            marginBottom: '16px',
            fontFamily: 'var(--font-courier-prime), monospace',
            letterSpacing: '1px'
          }}>
            CONTACT
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '12px',
            color: '#333'
          }}>
            <p>Email: hello@k2.com</p>
            <p>Tel: (555) 123-4567</p>
            <p>Scottsdale, AZ</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        borderTop: '1px solid #eee',
        marginTop: '40px',
        paddingTop: '20px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#666'
      }}>
        <p>© {new Date().getFullYear()} K2. All rights reserved.</p>
      </div>
    </footer>
  );
}
