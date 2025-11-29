import React, { useState, useMemo, useEffect } from 'react';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/features/ProductCard';
import { useCategoriesStore } from '../../store/useCategoriesStore';
import { useProductStore } from '../../store/useProductStore';
import { mapVariantToProduct } from '../../lib/mappers';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');

  const { products: apiProducts, fetchProducts, isLoading } = useProductStore();
  const { categories, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    console.log('Selected Category ID:', selectedCategoryId);
    const categoryParam = selectedCategoryId !== 'all' ? selectedCategoryId : undefined;
    console.log('Passing category_id to API:', categoryParam);
    
    fetchProducts({
      category_id: categoryParam,
    });
  }, [selectedCategoryId, fetchProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = apiProducts.map(mapVariantToProduct);

    // Filter by search query (Client-side for now)
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort products (Client-side)
    switch (sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered = [...filtered].sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return filtered;
  }, [apiProducts, searchQuery, sortBy]);

  return (
    <div className="pb-20 lg:pb-0 bg-neutral-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-[#2d5016] text-white pt-8 pb-12 px-6 rounded-b-[2rem] shadow-xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.4) 0%, transparent 50%)'
          }}
        />
        
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold font-['Playfair_Display'] mb-2">
            Explore Collections
          </h1>
          <p className="text-white/80 mb-8 max-w-xl">
            Discover our curated selection of premium plants and accessories for your home.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <SearchIcon size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for plants, pots, or accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white text-gray-900 rounded-2xl shadow-lg border-none focus:ring-2 focus:ring-[#d4af37] placeholder-gray-400 text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
        {/* Categories Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`flex-shrink-0 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm ${
              selectedCategoryId === 'all'
                ? 'bg-[#d4af37] text-white shadow-md scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Items
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center gap-2 ${
                selectedCategoryId === category.id
                  ? 'bg-[#d4af37] text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category.icon && <span>{category.icon}</span>}
              <span>{category.category_name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <p className="text-gray-600 font-medium">
            Showing <span className="text-[#2d5016] font-bold">{filteredProducts.length}</span> results
          </p>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <SlidersHorizontal size={16} className="text-gray-500" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d5016] appearance-none cursor-pointer hover:border-gray-300 shadow-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5016]"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchIcon size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">
              No matches found
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              We couldn't find any products matching your search. Try checking for typos or using different keywords.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryId('all');
              }}
              className="px-8 py-3 bg-[#2d5016] text-white rounded-full font-bold hover:bg-[#3d6622] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
