import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isLoading: cartLoading } = useCartStore();
  const { toggleWishlist, isInWishlist, isLoading: wishlistLoading } = useWishlistStore();
  const { setShowLoginPrompt, setPendingAction } = useUIStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (cartLoading) return;

    const addToCartAction = async () => {
      try {
        await addToCart(product, 1);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    };

    if (!isAuthenticated) {
      setPendingAction(addToCartAction);
      setShowLoginPrompt(true);
    } else {
      await addToCartAction();
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (wishlistLoading) return;

    const toggleWishlistAction = async () => {
      try {
        await toggleWishlist(product);
      } catch (error) {
        console.error('Failed to toggle wishlist:', error);
      }
    };

    if (!isAuthenticated) {
      setPendingAction(toggleWishlistAction);
      setShowLoginPrompt(true);
    } else {
      await toggleWishlistAction();
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl border border-gray-200/50"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse" />
        )}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } group-hover:scale-105`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#2d5016] to-[#3d6622] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            {product.discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={wishlistLoading}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            inWishlist
              ? 'bg-[#2d5016] text-white'
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={18}
            fill={inWishlist ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        </button>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={cartLoading}
          className={`absolute bottom-0 left-0 right-0 py-3.5 font-semibold text-sm transition-all duration-500 disabled:cursor-not-allowed ${
            addedToCart
              ? 'bg-[#2d5016] text-white translate-y-0'
              : 'bg-white/95 text-gray-900 translate-y-full group-hover:translate-y-0'
          }`}
        >
          {cartLoading ? (
            <span className="flex items-center justify-center gap-2">
              ... Adding
            </span>
          ) : addedToCart ? (
            <span className="flex items-center justify-center gap-2">
              ✓ Added to Cart
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart size={16} /> Add to Cart
            </span>
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-sm md:text-base font-medium text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-[#2d5016] transition-colors font-sans">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.floor(product.rating) ? 'fill-[#d4af37] text-[#d4af37]' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-base md:text-lg font-bold text-[#2d5016] font-sans tracking-wide">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through font-sans">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
