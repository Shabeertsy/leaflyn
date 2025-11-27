# Leafin E-Commerce - Project Structure

## 📁 Folder Organization

```
src/
├── components/
│   ├── layout/           # Layout components (Header, Footer, BottomNav, etc.)
│   └── features/         # Feature-specific components (ProductCard, PWAInstallBanner)
├── pages/
│   ├── auth/            # Authentication pages (Login, Register)
│   ├── shop/            # Shopping pages (ProductDetail, Cart, Checkout, etc.)
│   ├── user/            # User-related pages (Account, Notifications)
│   └── Home.tsx         # Landing page
├── store/               # Zustand state management
│   ├── useCartStore.ts
│   ├── useWishlistStore.ts
│   ├── useAuthStore.ts
│   ├── useUIStore.ts
│   └── index.ts         # Store exports
├── routes/              # Route definitions
│   └── AppRoutes.tsx
├── lib/                 # Third-party library configurations
│   └── axios.ts         # Axios instance with interceptors
├── hooks/               # Custom React hooks
├── data/                # Static data and mock data
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── App.tsx              # Main app component
```

## 🏪 State Management (Zustand)

### Cart Store (`useCartStore`)
Manages shopping cart state with persistence.

**State:**
- `cart: CartItem[]` - Array of cart items

**Actions:**
- `addToCart(product, quantity?)` - Add product to cart
- `removeFromCart(productId)` - Remove item from cart
- `updateCartQuantity(productId, quantity)` - Update item quantity
- `clearCart()` - Clear all cart items
- `getCartTotal()` - Calculate total price
- `getCartCount()` - Get total item count

**Usage:**
```tsx
import { useCartStore } from '../store/useCartStore';

const Component = () => {
  const { cart, addToCart, getCartTotal } = useCartStore();
  const cartTotal = getCartTotal();
  
  // Or use selectors for specific values
  const cartCount = useCartStore((state) => state.getCartCount());
};
```

### Wishlist Store (`useWishlistStore`)
Manages user wishlist with persistence.

**State:**
- `wishlist: WishlistItem[]` - Array of wishlist items

**Actions:**
- `addToWishlist(productId)` - Add product to wishlist
- `removeFromWishlist(productId)` - Remove from wishlist
- `isInWishlist(productId)` - Check if product is in wishlist

**Usage:**
```tsx
import { useWishlistStore } from '../store/useWishlistStore';

const Component = () => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const inWishlist = wishlist.some(item => item.productId === productId);
};
```

### Auth Store (`useAuthStore`)
Manages authentication state with persistence.

**State:**
- `user: User | null` - Current user object
- `isAuthenticated: boolean` - Authentication status

**Actions:**
- `setUser(user)` - Set current user
- `logout()` - Clear user and logout

**Usage:**
```tsx
import { useAuthStore } from '../store/useAuthStore';

const Component = () => {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
};
```

### UI Store (`useUIStore`)
Manages UI state (modals, drawers, etc.).

**State:**
- `showMobileMenu: boolean`
- `showCart: boolean`

**Actions:**
- `setShowMobileMenu(show)` - Set mobile menu visibility
- `setShowCart(show)` - Set cart drawer visibility
- `toggleMobileMenu()` - Toggle mobile menu
- `toggleCart()` - Toggle cart drawer

**Usage:**
```tsx
import { useUIStore } from '../store/useUIStore';

const Component = () => {
  const { showCart, setShowCart } = useUIStore();
};
```

## 🌐 API Configuration (Axios)

The Axios instance is configured in `src/lib/axios.ts` with:

- **Base URL**: Configured via `VITE_API_URL` environment variable
- **Request Interceptor**: Automatically adds auth token from localStorage
- **Response Interceptor**: Handles 401 errors globally

**Usage:**
```tsx
import api from '../lib/axios';

// GET request
const response = await api.get('/products');

// POST request
const response = await api.post('/auth/login', { email, password });

// With auth token (automatically added)
const response = await api.get('/user/profile');
```

**Environment Variables:**
Create a `.env` file:
```
VITE_API_URL=http://localhost:3000/api
```

## 🛣️ Routing

Routes are centralized in `src/routes/AppRoutes.tsx`.

**Adding a new route:**
```tsx
// In AppRoutes.tsx
<Route path="/new-page" element={<NewPage />} />
```

## 📦 Component Organization

### Layout Components (`components/layout/`)
- `Header.tsx` - Top navigation bar
- `Footer.tsx` - Footer section
- `BottomNav.tsx` - Mobile bottom navigation
- `CartDrawer.tsx` - Sliding cart drawer
- `ScrollToTop.tsx` - Scroll restoration on route change

### Feature Components (`components/features/`)
- `ProductCard.tsx` - Product card component
- `PWAInstallBanner.tsx` - PWA installation prompt

## 🔄 Migration from Context API to Zustand

The app has been migrated from React Context to Zustand for better performance and simpler state management.

**Old (Context API):**
```tsx
import { useApp } from '../context/AppContext';

const { cart, addToCart, cartTotal } = useApp();
```

**New (Zustand):**
```tsx
import { useCartStore } from '../store/useCartStore';

const { cart, addToCart, getCartTotal } = useCartStore();
const cartTotal = getCartTotal();
```

## 🚀 Best Practices

1. **Import from store index**: Use `import { useCartStore } from '../store'` when possible
2. **Use selectors for derived state**: `useCartStore((state) => state.getCartCount())`
3. **Keep stores focused**: Each store handles one domain (cart, auth, etc.)
4. **Persist important state**: Cart, wishlist, and auth are persisted to localStorage
5. **Use TypeScript**: All stores and components are fully typed

## 📝 Adding New Features

### Adding a new store:
1. Create `src/store/useNewStore.ts`
2. Define interface and create store with `create()`
3. Add persistence if needed with `persist()` middleware
4. Export from `src/store/index.ts`

### Adding a new page:
1. Create component in appropriate folder (`pages/auth/`, `pages/shop/`, etc.)
2. Add route in `src/routes/AppRoutes.tsx`
3. Import required stores using Zustand hooks

### Adding a new API endpoint:
1. Use the axios instance from `src/lib/axios.ts`
2. Create a service file in `src/services/` if needed
3. Handle errors appropriately

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Firebase
npm run build && npx firebase deploy --only hosting
```

## 📚 Dependencies

- **zustand**: State management
- **axios**: HTTP client
- **react-router-dom**: Routing
- **lucide-react**: Icons
- **tailwindcss**: Styling

## 🎯 Future Enhancements

- [ ] Add API service layer
- [ ] Implement React Query for server state
- [ ] Add error boundary components
- [ ] Implement lazy loading for routes
- [ ] Add unit tests for stores
- [ ] Add E2E tests with Playwright
