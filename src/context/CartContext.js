import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "@pilar_de_sonrisas_cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  // Evita pisar el storage con el carrito vacío inicial antes de terminar de
  // leer lo que había guardado.
  const hydrated = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setCart(parsed);
        }
      } catch {
        // Si el storage está corrupto o no disponible, seguimos con carrito vacío.
      } finally {
        hydrated.current = true;
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cart)).catch(() => {});
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + safeQuantity }
            : item
        );
      }

      return [
        ...current,
        {
          product,
          quantity: safeQuantity,
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
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    assignFoundation,
    clearCart,
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
