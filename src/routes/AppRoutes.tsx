import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ProductDetail from '../pages/shop/ProductDetail';
import Cart from '../pages/shop/Cart';
import Checkout from '../pages/shop/Checkout';
import Search from '../pages/shop/Search';
import Wishlist from '../pages/shop/Wishlist';
import Account from '../pages/user/Account';
import Notifications from '../pages/user/Notifications';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/account" element={<Account />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Placeholder routes */}
      <Route path="/category/:slug" element={<Search />} />
      <Route path="/featured" element={<Search />} />
      <Route path="/bestsellers" element={<Search />} />
      <Route path="/new-arrivals" element={<Search />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<Account />} />
      <Route path="/profile/edit" element={<Account />} />
      <Route path="/addresses" element={<Account />} />
      <Route path="/payment-methods" element={<Account />} />
      <Route path="/rewards" element={<Account />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Account />} />
      <Route path="/help" element={<Account />} />
      <Route path="/terms" element={<Account />} />
      <Route path="/privacy" element={<Account />} />
      <Route path="/care-guide" element={<Account />} />
    </Routes>
  );
};

export default AppRoutes;
