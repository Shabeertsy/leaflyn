import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

const Cart: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, getCartCount } = useCartStore();
  const cartTotal = getCartTotal();
  const cartCount = getCartCount();

  const shipping = cartTotal >= 499 ? 0 : 50;
  const tax = 0; // No tax applied
  const total = cartTotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center bg-neutral-50">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[#2d5016]/5 border border-gray-100">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-bold text-[#2d5016] mb-3 font-['Playfair_Display']">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md font-light">
          Looks like you haven't added any plants yet. Start your green journey today!
        </p>
        <Link
          to="/search"
          className="group inline-flex items-center gap-2 px-8 py-3.5 bg-[#2d5016] text-white rounded-full font-bold hover:bg-[#3d6622] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Start Shopping
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
          <h1 className="text-3xl font-bold text-[#2d5016] font-['Playfair_Display']">Shopping Cart</h1>
          <p className="text-sm text-gray-500 mt-1">{cartCount} items in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <Link to={`/product/${item.product.id}`} className="flex-shrink-0 relative group">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-bold text-gray-900 line-clamp-2 hover:text-[#2d5016] transition-colors font-['Playfair_Display'] text-lg">
                          {item.product.name}
                        </h3>
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-[#2d5016] font-sans">₹{item.product.price}</p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Item Total */}
                    <p className="font-bold text-lg text-gray-900 font-sans">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-96 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-xl text-[#2d5016] mb-6 font-['Playfair_Display']">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900 font-sans">₹{cartTotal}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900 font-sans">
                    {shipping === 0 ? (
                      <span className="text-[#2d5016] font-bold">Free</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-semibold text-gray-900 font-sans">₹{tax}</span>
                </div>

                {cartTotal < 499 && (
                  <div className="bg-amber-50 text-amber-800 text-xs px-4 py-3 rounded-xl flex items-start gap-2">
                    <Truck size={16} className="shrink-0 mt-0.5" />
                    <p>Add <strong>₹{499 - cartTotal}</strong> more to get free shipping!</p>
                  </div>
                )}
              </div>
              
              <div className="border-t border-dashed border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-gray-900 font-bold">Total</span>
                  <span className="text-2xl md:text-3xl font-bold text-[#2d5016] font-sans tracking-wide">₹{total}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">Including all taxes</p>
              </div>

              <Link
                to="/checkout"
                className="group flex items-center justify-center gap-2 w-full py-4 bg-[#2d5016] text-white rounded-xl font-bold hover:bg-[#3d6622] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Proceed to Checkout
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck size={14} className="text-[#2d5016]" />
                <span>Secure Checkout & Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
