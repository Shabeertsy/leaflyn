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
import Categories from '../pages/shop/Categories';
import Services from '../pages/Services';
import ServiceDetail from '../pages/ServiceDetail';
import Account from '../pages/user/Account';
import PersonalInfo from '../pages/user/PersonalInfo';
import Notifications from '../pages/user/Notifications';
import ContactUs from '../pages/ContactUs';
import TermsConditions from '../pages/TermsConditions';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<ServiceDetail />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      
      {/* Public Routes (only accessible if NOT logged in) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      
      {/* Protected Routes (only accessible if logged in) */}
      <Route element={<PrivateRoute />}>
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<Account />} />
        <Route path="/profile/edit" element={<PersonalInfo />} />
        <Route path="/addresses" element={<Account />} />
        <Route path="/payment-methods" element={<Account />} />
        <Route path="/rewards" element={<Account />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Account />} />
      </Route>

      {/* Placeholder routes */}
      <Route path="/category/:slug" element={<Search />} />
      <Route path="/featured" element={<Search />} />
      <Route path="/bestsellers" element={<Search />} />
      <Route path="/new-arrivals" element={<Search />} />
      <Route path="/help" element={<Account />} />
      <Route path="/terms" element={<TermsConditions />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/privacy" element={<Account />} />
      <Route path="/care-guide" element={<Account />} />
    </Routes>
  );
};

export default AppRoutes;
