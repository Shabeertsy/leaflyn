import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';

/**
 * Custom hook to sync cart and wishlist data when user is authenticated
 * Call this hook in your main App component or layout
 */
export const useAuthSync = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Only fetch if authenticated and haven't fetched yet
    if (isAuthenticated && !hasFetched.current) {
      hasFetched.current = true;
      
      // Fetch cart and wishlist when user is authenticated
      fetchCart().catch((error) => {
        console.error('Failed to fetch cart on auth:', error);
      });
      
      fetchWishlist().catch((error) => {
        console.error('Failed to fetch wishlist on auth:', error);
      });
    }
    
    // Reset flag when user logs out
    if (!isAuthenticated) {
      hasFetched.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
};
