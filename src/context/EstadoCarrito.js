import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existe = prev.find((item) => item.id === product.id);
      if (existe) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          foundationId: null,
        },
      ];
    });
  };

  const increaseQuantity = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const assignFoundation = (productId, foundationId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, foundationId } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const confirmOrder = () => {
    setLastOrder({
      items: cart,
      totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      confirmedAt: new Date().toISOString(),
    });
    setCart([]);
  };

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const hasMissingFoundation = useMemo(
    () => cart.some((item) => !item.foundationId),
    [cart]
  );

  const value = {
    cart,
    totalItems,
    totalPrice,
    hasMissingFoundation,
    lastOrder,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    assignFoundation,
    clearCart,
    confirmOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}