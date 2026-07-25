import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // { animalId, title, shares, pricePerShare, maxShares }

  function addItem(animal, shares) {
    setItems((prev) => {
      const existing = prev.find((i) => i.animalId === animal.id);
      if (existing) {
        const nextShares = Math.min(animal.available_shares, existing.shares + shares);
        return prev.map((i) => (i.animalId === animal.id ? { ...i, shares: nextShares } : i));
      }
      return [...prev, {
        animalId: animal.id,
        title: animal.title,
        category: animal.category,
        shares,
        pricePerShare: Number(animal.price_per_share),
        maxShares: animal.available_shares,
      }];
    });
  }

  function removeItem(animalId) {
    setItems((prev) => prev.filter((i) => i.animalId !== animalId));
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.shares * i.pricePerShare, 0);
  const count = items.reduce((sum, i) => sum + i.shares, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
