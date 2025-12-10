import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';

interface ProductCardCompactProps {
  product: Product;
}

const ProductCardCompact: React.FC<ProductCardCompactProps> = ({ product }) => {
  const { addToCart, isLoading: cartLoading } = useCartStore();
  const { setShowLoginPrompt, setPendingAction } = useUIStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

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

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block w-[120px] flex-shrink-0"
    >
      {/* Image Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-2 border border-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse" />
        )}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="pr-1">
        {/* Name */}
        <h3 className="text-[13px] font-medium text-gray-900 mb-1 leading-tight line-clamp-2 min-h-[32px]">
          {product.name}
        </h3>

        {/* Price and Add Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-[#2d5016]">
              ₹{product.price}
            </span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all duration-300 ${
              addedToCart
                ? 'bg-[#2d5016] text-white'
                : 'bg-green-100/80 text-[#2d5016] hover:bg-[#2d5016] hover:text-white'
            }`}
          >
            {addedToCart ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCardCompact;
