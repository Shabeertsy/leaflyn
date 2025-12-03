import React, { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import type { Product } from '../../types';

interface ProductCardActionsProps {
  product: Product;
}

/**
 * Example component showing how to integrate Cart and Wishlist APIs
 * Use this as a reference for implementing add to cart and wishlist features
 */
const ProductCardActions: React.FC<ProductCardActionsProps> = ({ product }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Cart store
  const { addToCart, isLoading: cartLoading } = useCartStore();
  
  // Wishlist store
  const { 
    isInWishlist, 
    toggleWishlist, 
    isLoading: wishlistLoading 
  } = useWishlistStore();
  
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async () => {
    try {
      // Pass full product object
      await addToCart(product, 1);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(product);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      alert('Failed to update wishlist. Please try again.');
    }
  };

  return (
    <div className="flex gap-2">
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={cartLoading || !product.inStock}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingCart size={18} />
        {cartLoading ? 'Adding...' : 'Add to Cart'}
      </button>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        disabled={wishlistLoading}
        className={`p-2 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          inWishlist
            ? 'bg-red-50 border-red-500 text-red-500'
            : 'bg-white border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
        }`}
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart 
          size={20} 
          fill={inWishlist ? 'currentColor' : 'none'}
        />
      </button>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          Added to cart!
        </div>
      )}
    </div>
  );
};

export default ProductCardActions;
