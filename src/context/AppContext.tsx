import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, Product, WishlistItem, User } from '../types';

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // User
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;

  // UI State
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('leafin_cart');
    const savedWishlist = localStorage.getItem('leafin_wishlist');
    const savedUser = localStorage.getItem('leafin_user');

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }

    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Error loading wishlist:', e);
      }
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error loading user:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('leafin_cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('leafin_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('leafin_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('leafin_user');
    }
  }, [user]);

  // Cart functions
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Wishlist functions
  const addToWishlist = (productId: string) => {
    setWishlist(prevWishlist => {
      const exists = prevWishlist.find(item => item.productId === productId);
      if (exists) return prevWishlist;
      
      return [...prevWishlist, { productId, addedAt: new Date() }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prevWishlist =>
      prevWishlist.filter(item => item.productId !== productId)
    );
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.productId === productId);
  };

  const isAuthenticated = user !== null;

  const value: AppContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartCount,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    user,
    setUser,
    isAuthenticated,
    showMobileMenu,
    setShowMobileMenu,
    showCart,
    setShowCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
