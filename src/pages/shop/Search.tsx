import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/features/ProductCard';
import { useCategoriesStore } from '../../store/useCategoriesStore';
import { useProductStore } from '../../store/useProductStore';
import { mapVariantToProduct } from '../../lib/mappers';
import { useSearchUIStore } from '../../store/useSearchUIStore';

// Get base URL for images
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  return `${baseURL}${imagePath}`;
};

const Search: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const location = useLocation();
  
  const {
    searchQuery, setSearchQuery,
    selectedCategoryId, setSelectedCategoryId,
    sortBy, setSortBy,
    allProducts, setAllProducts,
    currentPage, setCurrentPage,
    lastLoadedPage, setLastLoadedPage,
    nextPage: storeNextPage, setNextPage: setStoreNextPage,
    resetSearchState
  } = useSearchUIStore();

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { products, fetchProducts, isLoading, nextPage } = useProductStore();
  const { categories, fetchCategories } = useCategoriesStore();
  
  // Track the category we're currently fetching to prevent race conditions
  const activeCategoryRef = useRef<string>(selectedCategoryId);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch categories first
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle category from URL params (when coming from Home page)
  useEffect(() => {
    if (categories.length > 0 && !isInitialized) {
      let targetCategoryId = 'all';
      
      if (slug) {
        // Try to find category by slug first
        let category = categories.find(cat => cat.slug === slug);
        
        // If not found by slug, try by ID (in case slug is actually an ID)
        if (!category) {
          category = categories.find(cat => String(cat.id) === String(slug));
        }
        
        if (category) {
          targetCategoryId = String(category.id);
        }
      }

      // If target category differs from store, OR if we have no products (fresh start), reset.
      // But if target matches store AND we have products, we preserve state (restore).
      if (targetCategoryId !== selectedCategoryId) {
        console.log('Resetting search state - category changed');
        resetSearchState();
        setSelectedCategoryId(targetCategoryId);
        activeCategoryRef.current = targetCategoryId;
      } else if (allProducts.length > 0) {
        console.log('Restoring search state for category:', targetCategoryId);
        activeCategoryRef.current = targetCategoryId;
      }
      
      setIsInitialized(true);
    }
  }, [slug, categories, isInitialized, selectedCategoryId, allProducts.length, resetSearchState, setSelectedCategoryId]);

  // Reset when navigating to /search without params
  useEffect(() => {
    if (location.pathname === '/search' && !slug && isInitialized) {
      if (selectedCategoryId !== 'all') {
        console.log('Resetting to "all" - direct /search navigation');
        resetSearchState();
        setSelectedCategoryId('all');
        activeCategoryRef.current = 'all';
      }
    }
  }, [location.pathname, slug, isInitialized, resetSearchState, setSelectedCategoryId]);

  // Debounce search query (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Scroll selected category button into view
  useEffect(() => {
    if (isInitialized && selectedCategoryId !== 'all') {
      const button = document.querySelector(`button[data-category-id="${selectedCategoryId}"]`);
      if (button) {
        button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [isInitialized, selectedCategoryId]);

  // Reset products when category or search changes (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    
    // Check if category has actually changed
    const categoryChanged = activeCategoryRef.current !== selectedCategoryId;
    
    // Always fetch if category changed or if we don't have products yet
    const shouldFetch = categoryChanged || allProducts.length === 0;
    
    if (!shouldFetch) {
       console.log('Skipping fetch - No changes detected');
       return;
    }

    console.log('Fetching products - Category:', selectedCategoryId, 'Search:', debouncedSearchQuery);
    const categoryParam = selectedCategoryId !== 'all' ? selectedCategoryId : undefined;
    
    // Update the active category ref
    activeCategoryRef.current = selectedCategoryId;
    
    // Reset store state for new search
    setCurrentPage(1);
    setAllProducts([]); 
    setIsLoadingMore(false);
    setLastLoadedPage(0);
    setStoreNextPage(null);
    
    // Fetch new products with search query
    fetchProducts({
      category_id: categoryParam,
      q: debouncedSearchQuery || undefined,
      page: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId, debouncedSearchQuery, isInitialized]); 

  // Watch for products changes and accumulate them
  useEffect(() => {
    // Only process products if they're for the currently selected category
    if (activeCategoryRef.current !== selectedCategoryId) {
      return;
    }
    
    // Don't process products if we're currently loading (prevents using stale data)
    if (isLoading && currentPage === 1) {
      return;
    }
    
    // If we have products and they haven't been loaded yet for this page
    if (products.length > 0 && currentPage !== lastLoadedPage) {
      const mappedProducts = products.map(mapVariantToProduct);
      
      if (currentPage === 1) {
        setAllProducts(mappedProducts);
      } else {
        setAllProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewProducts = mappedProducts.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNewProducts];
        });
      }
      
      setLastLoadedPage(currentPage);
      setIsLoadingMore(false);
      setStoreNextPage(nextPage);
    } else if (products.length === 0 && currentPage === 1 && currentPage !== lastLoadedPage && !isLoading) {
      setAllProducts([]);
      setLastLoadedPage(currentPage);
      setIsLoadingMore(false);
      setStoreNextPage(null);
    }
  }, [products, currentPage, lastLoadedPage, selectedCategoryId, isLoading, nextPage, setAllProducts, setLastLoadedPage, setStoreNextPage]);

  // Infinite scroll observer
  const loadMore = useCallback(() => {
    if (storeNextPage && !isLoading && !isLoadingMore && currentPage === lastLoadedPage) {
      setIsLoadingMore(true);
      const categoryParam = selectedCategoryId !== 'all' ? selectedCategoryId : undefined;
      const nextPageNum = currentPage + 1;
      
      setCurrentPage(nextPageNum);
      
      fetchProducts({
        category_id: categoryParam,
        q: debouncedSearchQuery || undefined,
        page: nextPageNum,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeNextPage, isLoading, isLoadingMore, selectedCategoryId, debouncedSearchQuery, currentPage, lastLoadedPage]); // fetchProducts is stable

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore]);

  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Search is now handled server-side via API
    // Only client-side sorting remains
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
  }, [allProducts, sortBy]);

  return (
    <div className="pb-20 lg:pb-0 bg-neutral-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-[#2d5016] text-white pt-6 pb-8 md:pt-8 md:pb-12 px-4 md:px-6 rounded-b-[1.5rem] md:rounded-b-[2rem] shadow-xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.4) 0%, transparent 50%)'
          }}
        />
        
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-['Playfair_Display'] mb-2">
            Explore Collections
          </h1>
          <p className="text-sm md:text-base text-white/80 mb-6 md:mb-8 max-w-xl">
            Discover our curated selection of premium plants and accessories for your home.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-3 md:left-4 flex items-center pointer-events-none">
              <SearchIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-10 md:pr-12 py-3 md:py-4 bg-white text-gray-900 rounded-xl md:rounded-2xl shadow-lg border-none focus:ring-2 focus:ring-[#d4af37] placeholder-gray-400 text-sm md:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-5 md:-mt-6 relative z-10">
        {/* Categories Scroll - Redesigned */}
        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 no-scrollbar scrollbar-hide">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`group flex-shrink-0 px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 ${
              selectedCategoryId === 'all'
                ? 'bg-gradient-to-r from-[#2d5016] to-[#3d6622] text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-[#2d5016]/30 hover:shadow-md'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={`text-base ${selectedCategoryId === 'all' ? 'animate-pulse' : ''}`}>🌿</span>
              <span>All Items</span>
            </span>
          </button>
          {categories.map((category) => {
            // Ensure we compare as strings to handle potential number/string mismatches
            const isSelected = String(selectedCategoryId) === String(category.id);
            
            return (
              <button
                key={category.id}
                data-category-id={category.id}
                onClick={() => setSelectedCategoryId(String(category.id))}
                className={`group flex-shrink-0 px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-semibold text-xs md:text-sm transition-all duration-300 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#2d5016] to-[#3d6622] text-white shadow-lg scale-105 ring-2 ring-[#2d5016]/50'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-[#2d5016]/30 hover:shadow-md'
                }`}
              >
                {category.icon && (
                  <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg flex items-center justify-center transition-transform duration-300 ${
                    isSelected
                      ? 'bg-white/20 scale-110' 
                      : 'bg-gray-100 group-hover:bg-[#2d5016]/10'
                  }`}>
                    <img 
                      src={getImageUrl(category.icon)} 
                      alt="" 
                      className={`w-3 h-3 md:w-4 md:h-4 object-contain ${isSelected ? 'brightness-0 invert' : ''}`}
                    />
                  </div>
                )}
                <span className="whitespace-nowrap">{category.category_name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <p className="text-xs md:text-sm text-gray-600 font-medium">
            Showing <span className="text-[#2d5016] font-bold">{filteredProducts.length}</span> results
          </p>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <SlidersHorizontal className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-9 md:pl-10 pr-8 py-2 md:py-2.5 bg-white border border-gray-200 rounded-lg text-xs md:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d5016] appearance-none cursor-pointer hover:border-gray-300 shadow-sm"
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
        {isLoading && currentPage === 1 ? (
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
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {nextPage && (
              <div ref={observerTarget} className="mt-12 flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2d5016]"></div>
              </div>
            )}

            {/* End of Results */}
            {!nextPage && allProducts.length > 0 && (
              <div className="mt-12 text-center py-8">
                <p className="text-gray-500 font-medium">You've reached the end of the results</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
