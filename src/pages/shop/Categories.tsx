import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useCategoriesStore } from '../../store/useCategoriesStore';

// Get base URL for images
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return `${baseURL}${imagePath}`;
};

const Categories: React.FC = () => {
  const { categories, loading, error, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-[#2d5016] animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Categories</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={fetchCategories}
            className="px-6 py-3 bg-[#2d5016] text-white rounded-full font-semibold hover:bg-[#3d6622] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-neutral-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#2d5016] transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
          <div>
            <span className="text-[#d4af37] font-bold tracking-widest uppercase text-xs mb-2 block">Browse</span>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#2d5016] font-['Playfair_Display'] mb-3">
              All Collections
            </h1>
            <p className="text-gray-500 text-lg font-light">
              Explore our complete range of curated plant collections and accessories
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/search/${category.slug || category.id}`}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-neutral-100 transition-transform duration-700 group-hover:scale-110">
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  index % 3 === 0 ? 'from-green-50 to-emerald-100' :
                  index % 3 === 1 ? 'from-teal-50 to-cyan-100' :
                  'from-amber-50 to-orange-100'
                }`} />
                
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/40 rounded-full blur-2xl transform -translate-x-10 translate-y-10" />
              </div>

              {/* Content Container */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {category.icon ? (
                      <img 
                        src={getImageUrl(category.icon)} 
                        alt="" 
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <span className="text-4xl">🌿</span>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full border border-gray-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-white">
                    <ArrowRight size={16} className="text-[#2d5016]" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 font-['Playfair_Display'] mb-3 group-hover:text-[#2d5016] transition-colors">
                    {category.category_name}
                  </h3>
                  <p className="text-gray-600 text-sm lg:text-base opacity-80 line-clamp-2 mb-4 group-hover:opacity-100 transition-opacity">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span className="w-8 h-[1px] bg-gray-400 group-hover:w-12 group-hover:bg-[#2d5016] transition-all duration-300" />
                    {category.productCount} Products
                  </div>
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#2d5016]/10 rounded-3xl transition-colors duration-300 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
