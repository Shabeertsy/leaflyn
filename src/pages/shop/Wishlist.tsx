import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '../../store/useWishlistStore';
import { products } from '../../data/products';
import ProductCard from '../../components/features/ProductCard';

const Wishlist: React.FC = () => {
  const wishlist = useWishlistStore((state) => state.wishlist);

  const wishlistProducts = products.filter((product) =>
    wishlist.some((item) => item.productId === product.id)
  );

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center bg-neutral-50">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[#2d5016]/5 border border-gray-100">
          <Heart size={40} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-bold text-[#2d5016] mb-3 font-['Playfair_Display']">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md font-light">
          Create your dream garden by saving your favorite plants and accessories for later.
        </p>
        <Link
          to="/search"
          className="group inline-flex items-center gap-2 px-8 py-3.5 bg-[#2d5016] text-white rounded-full font-bold hover:bg-[#3d6622] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Explore Collection
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-12 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#2d5016] font-['Playfair_Display']">My Wishlist</h1>
              <p className="text-sm text-gray-500 mt-1">{wishlist.length} items saved</p>
            </div>
            <Link 
              to="/cart"
              className="hidden md:flex items-center gap-2 text-[#2d5016] font-semibold hover:text-[#d4af37] transition-colors"
            >
              Go to Cart <ShoppingBag size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
