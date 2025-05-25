import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images?: string[];
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

const getStoredCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

export const useCart = create<CartStore>((set) => ({
  items: [],


  isOpen: false,
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        const newItems = state.items.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
        localStorage.setItem('cart', JSON.stringify(newItems));
        return { items: newItems };
      }
      const newItems = [...state.items, { ...item, quantity: 1 }];
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems, isOpen: true };
    }),
  removeItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    }),
  updateQuantity: (id, quantity) =>
    set((state) => {
      const newItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      );
      localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    }),
  clearCart: () => {
    localStorage.removeItem('cart');
    set({ items: [] });
  },
  setIsOpen: (isOpen) => set({ isOpen }),
}));
