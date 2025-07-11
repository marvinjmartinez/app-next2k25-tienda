
// src/context/cart-context.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth, type User, type UserRole } from './auth-context';
import { getProducts, type Product } from '@/lib/dummy-data';

// Define the shape of a cart item
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Define the shape of the cart context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

// Create the context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

const GUEST_CART_KEY = 'distrimin_cart_guest';

const getPriceForCustomer = (product: Product, customerRole: UserRole) => {
  if (!product.priceTiers) {
      return product.price; // Fallback
  }

  switch (customerRole) {
      case 'cliente_especial':
          return product.priceTiers.cliente_especial;
      case 'vendedor':
          return product.priceTiers.vendedor;
      case 'cliente':
      case 'admin':
      default:
          return product.priceTiers.cliente;
  }
}

// Create the provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user, isLoading } = useAuth();
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  
  const getCartStorageKey = () => {
      return user ? `distrimin_cart_${user.id}` : GUEST_CART_KEY;
  }

  // Effect to load cart from localStorage when user or loading state changes.
  useEffect(() => {
    // Wait until auth is resolved.
    if (isLoading) return;

    const cartKey = getCartStorageKey();
    try {
      const storedCart = localStorage.getItem(cartKey);
      if (storedCart) {
        const parsedCart: CartItem[] = JSON.parse(storedCart);

        // Recalculate prices on load, in case user role or prices changed
        const allProducts = getProducts();
        const updatedCart = parsedCart.map(item => {
          const productData = allProducts.find(p => p.id === item.id);
          if (productData) {
            return {
              ...item,
              price: getPriceForCustomer(productData, user?.role || 'cliente'),
            };
          }
          return item;
        });
        setCartItems(updatedCart);

      } else {
        // If no specific cart is found for the user/guest, clear items.
        setCartItems([]);
      }
    } catch (error) {
        console.error("Failed to load cart from localStorage", error);
        setCartItems([]); // Reset on error
    } finally {
        setIsCartLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  // Effect to save cart to localStorage whenever it changes.
  useEffect(() => {
    // Only save after initial load has completed.
    if (isCartLoaded) {
      const cartKey = getCartStorageKey();
      try {
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart to localStorage", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems, isCartLoaded]);


  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        // If item exists, update its quantity
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      // Otherwise, add the new item
      return [...prevItems, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
