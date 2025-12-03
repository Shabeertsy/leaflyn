// ============================================
// CART & WISHLIST API - QUICK REFERENCE
// ============================================

// 1. ADD TO CART
// ============================================
import { useCartStore } from '../store/useCartStore';

const { addToCart, isLoading } = useCartStore();

const handleAddToCart = async (variantUuid: string) => {
  try {
    await addToCart(variantUuid, 1); // variantUuid, quantity
    console.log('Added to cart!');
  } catch (error) {
    console.error('Failed:', error);
  }
};

// 2. UPDATE CART QUANTITY
// ============================================
const { updateCartQuantity, findCartItemUuid } = useCartStore();

const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
  const cartItemUuid = findCartItemUuid(productId);
  if (cartItemUuid) {
    await updateCartQuantity(cartItemUuid, newQuantity);
  }
};

// 3. REMOVE FROM CART
// ============================================
const { removeFromCart, findCartItemUuid } = useCartStore();

const handleRemove = async (productId: string) => {
  const cartItemUuid = findCartItemUuid(productId);
  if (cartItemUuid) {
    await removeFromCart(cartItemUuid);
  }
};

// 4. GET CART DATA
// ============================================
const { cart, getCartTotal, getCartCount } = useCartStore();

const total = getCartTotal();
const itemCount = getCartCount();

// 5. WISHLIST TOGGLE
// ============================================
import { useWishlistStore } from '../store/useWishlistStore';

const { toggleWishlist, isInWishlist } = useWishlistStore();

const handleWishlistToggle = async (variantUuid: string) => {
  await toggleWishlist(variantUuid);
};

const inWishlist = isInWishlist(variantUuid);

// 6. GET WISHLIST DATA
// ============================================
const { wishlistProducts } = useWishlistStore();

// wishlistProducts contains full Product objects for display

// 7. LOADING STATES
// ============================================
const { isLoading: cartLoading } = useCartStore();
const { isLoading: wishlistLoading } = useWishlistStore();

<button disabled={cartLoading}>
  {cartLoading ? 'Adding...' : 'Add to Cart'}
</button>

// 8. ERROR HANDLING
// ============================================
const { error: cartError } = useCartStore();

{cartError && <div className="error">{cartError}</div>}

// ============================================
// IMPORTANT NOTES
// ============================================

// 1. Product ID vs Cart Item UUID
//    - product.id = variant UUID (for display)
//    - cartItemUuid = cart item UUID (for operations)
//    - Use findCartItemUuid() to convert

// 2. All operations are async
//    - Always use await
//    - Always wrap in try-catch

// 3. Authentication required
//    - User must be logged in
//    - Token automatically added by axios

// 4. Auto-sync on login
//    - Cart and wishlist automatically fetched
//    - Handled by useAuthSync hook in App.tsx
