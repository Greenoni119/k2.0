import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import CheckoutButton from './CheckoutButton';



export default function Cart() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, isOpen, setIsOpen } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Cart Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-100%',
          width: '100%',
          maxWidth: '400px',
          height: '100vh',
          backgroundColor: 'white',
          transition: 'right 0.3s ease-in-out',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '18px',
            fontFamily: 'Courier Prime, monospace'
          }}>
            my cart
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '0',
              fontFamily: 'Courier Prime, monospace'
            }}
          >
            ×
          </button>
        </div>

        {/* Cart Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px'
        }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                position: 'relative',
                paddingBottom: '24px',
                borderBottom: '1px solid #eee'
              }}
            >
              {item.images?.[0] && (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover'
                  }}
                />
              )}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '16px',
                  fontFamily: 'Courier Prime, monospace'
                }}>
                  {item.name}
                </p>

                <p style={{
                  margin: 0,
                  fontSize: '16px',
                  fontFamily: 'Courier Prime, monospace'
                }}>
                  ${item.price.toFixed(2)}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    style={{
                      width: '32px',
                      height: '32px',
                      border: '1px solid #ddd',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    -
                  </button>
                  <span style={{
                    minWidth: '20px',
                    textAlign: 'center'
                  }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{
                      width: '32px',
                      height: '32px',
                      border: '1px solid #ddd',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  right: '0',
                  background: 'none',
                  border: 'none',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  fontFamily: 'Courier Prime, monospace',
                  textDecoration: 'underline'
                }}
              >
                remove
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #eee',
          padding: '20px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '16px',
            fontFamily: 'Courier Prime, monospace'
          }}>
            <span>subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <CheckoutButton />
        </div>
      </div>
    </>
  );
}
