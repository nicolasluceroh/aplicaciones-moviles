import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          product,
          quantity: 1,
          foundationId: null,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart((current) =>
      current.filter((item) => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    setCart((current) =>
      current.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: safeQuantity }
          : item
      )
    );
  };

  const increaseQuantity = (productId) => {
    setCart((current) =>
      current.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((current) =>
      current.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const assignFoundation = (productId, foundationId) => {
    setCart((current) =>
      current.map((item) =>
        item.product.id === productId
          ? { ...item, foundationId }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Confirma la donación: guarda un snapshot en lastOrder y vacía el carrito
  const confirmOrder = () => {
    setLastOrder({
      items: cart,
      totalItems: cart.reduce((total, item) => total + item.quantity, 0),
      totalPrice: cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
      confirmedAt: new Date().toISOString(),
    });
    setCart([]);
  };

  const totalItems = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
    [cart]
  );

  const hasMissingFoundation = useMemo(
    () => cart.some((item) => !item.foundationId),
    [cart]
  );

  const value = {
    cart,
    lastOrder,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    assignFoundation,
    clearCart,
    confirmOrder,
    totalItems,
    totalPrice,
    hasMissingFoundation,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe utilizarse dentro de CartProvider");
  }

  return context;
}