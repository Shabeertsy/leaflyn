import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Search as SearchIcon, X, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/features/ProductCard';
import { useCategoriesStore } from '../../store/useCategoriesStore';
import { useProductStore } from '../../store/useProductStore';
import { mapVariantToProduct } from '../../lib/mappers';



const Search: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'rating'>('popular');
  const [isInitialized, setIsInitialized] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastLoadedPage, setLastLoadedPage] = useState(0);
  
  const { products, fetchProducts, isLoading, nextPage } = useProductStore();
  const { categories, fetchCategories } = useCategoriesStore();
  
  // Track the category we're currently fetching to prevent race conditions
  const activeCategoryRef = useRef<string>('all');
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch categories first
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle category from URL params (when coming from Home page)
  useEffect(() => {
    if (categories.length > 0 && !isInitialized) {
      console.log('Initializing with slug:', slug);
      console.log('Available categories:', categories.map(c => ({ id: c.id, slug: c.slug, name: c.category_name })));
      
      if (slug) {
        // Try to find category by slug first
        let category = categories.find(cat => cat.slug === slug);
        
        // If not found by slug, try by ID (in case slug is actually an ID)
        if (!category) {
          category = categories.find(cat => cat.id === slug);
        }
        
        if (category) {
          console.log('✓ Found category:', category.category_name, 'ID:', category.id);
          setSelectedCategoryId(category.id);
        } else {
          console.log('✗ Category not found for slug/id:', slug, '- defaulting to "all"');
          setSelectedCategoryId('all');
        }
      } else {
        console.log('No slug in URL - setting to "all"');
        setSelectedCategoryId('all');
      }
      setIsInitialized(true);
    }
  }, [slug, categories, isInitialized]);

  // Reset when navigating to /search without params
  useEffect(() => {
    if (location.pathname === '/search' && !slug && isInitialized) {
      console.log('Resetting to "all" - direct /search navigation');
      setSelectedCategoryId('all');
    }
  }, [location.pathname, slug, isInitialized]);

  // Scroll selected category button into view
  useEffect(() => {
    if (isInitialized && selectedCategoryId !== 'all') {
      const button = document.querySelector(`button[data-category-id="${selectedCategoryId}"]`);
      if (button) {
        button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [isInitialized, selectedCategoryId]);

  // Reset products when category changes (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    
    console.log('Category changed to:', selectedCategoryId);
    const categoryParam = selectedCategoryId !== 'all' ? selectedCategoryId : undefined;
    console.log('Fetching products with category_id:', categoryParam);
    
    // Update the active category ref
    activeCategoryRef.current = selectedCategoryId;
    
    // Reset all state
    setCurrentPage(1);
    setAllProducts([]); 
    setIsLoadingMore(false);
    setLastLoadedPage(0);
    
    // Fetch new products
    fetchProducts({
      category_id: categoryParam,
      page: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId, isInitialized]); // fetchProducts is stable from Zustand store

  // Watch for products changes and accumulate them
  useEffect(() => {
    console.log('Products from store:', products.length, 'Current page:', currentPage, 'Last loaded:', lastLoadedPage, 'isLoading:', isLoading);
    console.log('Active category:', activeCategoryRef.current, 'Selected category:', selectedCategoryId);
    
    // Only process products if they're for the currently selected category
    if (activeCategoryRef.current !== selectedCategoryId) {
      console.log('⚠️ Ignoring products - category mismatch');
      return;
    }
    
    // Don't process products if we're currently loading (prevents using stale data)
    if (isLoading && currentPage === 1) {
      console.log('⏳ Waiting for fresh products to load...');
      return;
    }
    
    // If we have products and they haven't been loaded yet for this page
    if (products.length > 0 && currentPage !== lastLoadedPage) {
      const mappedProducts = products.map(mapVariantToProduct);
      
      if (currentPage === 1) {
        console.log('✓ Setting initial products (page 1):', mappedProducts.length);
        // For page 1, always replace (this handles category changes)
        setAllProducts(mappedProducts);
      } else {
        console.log('✓ Appending products from page', currentPage);
        setAllProducts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewProducts = mappedProducts.filter(p => !existingIds.has(p.id));
          console.log('Adding', uniqueNewProducts.length, 'unique products. Total:', prev.length + uniqueNewProducts.length);
          return [...prev, ...uniqueNewProducts];
        });
      }
      
      setLastLoadedPage(currentPage);
      setIsLoadingMore(false);
    } else if (products.length === 0 && currentPage === 1 && currentPage !== lastLoadedPage && !isLoading) {
      // Handle empty results for page 1 (e.g., category with no products)
      console.log('✓ No products found for page 1 - clearing allProducts');
      setAllProducts([]);
      setLastLoadedPage(currentPage);
      setIsLoadingMore(false);
    }
  }, [products, currentPage, lastLoadedPage, selectedCategoryId, isLoading]);

  // Infinite scroll observer
  const loadMore = useCallback(() => {
    console.log('loadMore called', { nextPage, isLoading, isLoadingMore, currentPage, lastLoadedPage });
    
    if (nextPage && !isLoading && !isLoadingMore && currentPage === lastLoadedPage) {
      console.log('Loading next page...');
      setIsLoadingMore(true);
      const categoryParam = selectedCategoryId !== 'all' ? selectedCategoryId : undefined;
      const nextPageNum = currentPage + 1;
      
      setCurrentPage(nextPageNum);
      
      fetchProducts({
        category_id: categoryParam,
        page: nextPageNum,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextPage, isLoading, isLoadingMore, selectedCategoryId, currentPage, lastLoadedPage]); // fetchProducts is stable

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

    // Filter by search query (Client-side)
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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
  }, [allProducts, searchQuery, sortBy]);

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
        {/* Categories Scroll */}
        <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 no-scrollbar">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`flex-shrink-0 px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm transition-all shadow-sm ${
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
              data-category-id={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`flex-shrink-0 px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm transition-all shadow-sm flex items-center gap-1.5 md:gap-2 ${
                selectedCategoryId === category.id
                  ? 'bg-[#d4af37] text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category.icon && <span className="text-xs md:text-sm">{category.icon}</span>}
              <span>{category.category_name}</span>
            </button>
          ))}
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
