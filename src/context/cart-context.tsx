
// src/context/cart-context.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth, type User, type UserRole } from './auth-context';
import { getProducts, type Product } from '@/lib/dummy-data';

// Define the shape of a cart item
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Define the shape of the cart context
interface CartContextType {
  cartItems: CartItem[];
  selectedItems: Set<string>;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleItemSelection: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getSelectedItemsTotal: () => number;
  getSelectedItems: () => CartItem[];
  getCartItemCount: () => number;
  isItemSelected: (id: string) => boolean;
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
          return product.priceTiers.tipo2;
      case 'vendedor':
          return product.priceTiers.tipo3;
      case 'cliente':
      case 'admin':
      default:
          return product.priceTiers.tipo1;
  }
}

// Create the provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const { user, isLoading } = useAuth();
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  
  const getCartStorageKey = () => {
      return user ? `distrimin_cart_${user.id}` : GUEST_CART_KEY;
  }

  // Effect to load cart from localStorage when user or loading state changes.
  useEffect(() => {
    if (isLoading) return;

    const cartKey = getCartStorageKey();
    try {
      const storedCart = localStorage.getItem(cartKey);
      if (storedCart) {
        const parsedCart: CartItem[] = JSON.parse(storedCart);
        const allProducts = getProducts();
        const updatedCart = parsedCart.map(item => {
          const productData = allProducts.find(p => p.id === item.id);
          return {
            ...item,
            price: productData ? getPriceForCustomer(productData, user?.role || 'cliente') : item.price,
          };
        });
        setCartItems(updatedCart);
        // Initially, select all items when cart is loaded.
        setSelectedItems(new Set(updatedCart.map(item => item.id)));
      } else {
        setCartItems([]);
        setSelectedItems(new Set());
      }
    } catch (error) {
        console.error("Failed to load cart from localStorage", error);
        setCartItems([]);
    } finally {
        setIsCartLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  // Effect to save cart to localStorage whenever it changes.
  useEffect(() => {
    if (isCartLoaded) {
      const cartKey = getCartStorageKey();
      try {
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart to localStorage", error);
      }
    }
  }, [cartItems, isCartLoaded, user]);


  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prevItems, item];
    });
    // Select the new item automatically
    setSelectedItems(prev => new Set(prev).add(item.id));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
    });
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
    setSelectedItems(new Set());
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getSelectedItems = () => {
    return cartItems.filter(item => selectedItems.has(item.id));
  };
  
  const getSelectedItemsTotal = () => {
    return cartItems
      .filter(item => selectedItems.has(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        return newSet;
    });
  };

  const isItemSelected = (id: string) => {
    return selectedItems.has(id);
  }

  const value = {
    cartItems,
    selectedItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleItemSelection,
    isItemSelected,
    clearCart,
    getCartTotal,
    getSelectedItems,
    getSelectedItemsTotal,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
