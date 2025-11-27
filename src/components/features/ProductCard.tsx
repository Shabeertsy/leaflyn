import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlistStore();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const inWishlist = wishlist.some(item => item.productId === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
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
          <div className="absolute top-3 left-3 bg-[#2d5016] text-white text-xs font-bold px-3 py-1.5 rounded">
            -{product.discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
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
          className={`absolute bottom-0 left-0 right-0 py-3.5 font-semibold text-sm transition-all duration-500 ${
            addedToCart
              ? 'bg-[#2d5016] text-white translate-y-0'
              : 'bg-white/95 text-gray-900 translate-y-full group-hover:translate-y-0'
          }`}
        >
          {addedToCart ? (
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
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-[#2d5016] transition-colors">
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
          <span className="text-xl font-bold text-[#2d5016]">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
