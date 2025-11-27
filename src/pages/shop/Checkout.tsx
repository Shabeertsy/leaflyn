import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, CreditCard, MapPin, Plus, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getCartTotal } = useCartStore();
  const cartTotal = getCartTotal();
  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
  const [loading, setLoading] = useState(false);

  const shipping = cartTotal >= 499 ? 0 : 50;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + shipping + tax;

  const handlePlaceOrder = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      clearCart();
    }, 2000);
  };

  if (cart.length === 0 && step !== 'success') {
    navigate('/cart');
    return null;
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 text-center pb-20">
        <div className="w-28 h-28 bg-[#2d5016]/10 rounded-full flex items-center justify-center mb-8 animate-scale-in">
          <CheckCircle size={56} className="text-[#2d5016]" />
        </div>
        <h1 className="text-4xl font-bold text-[#2d5016] mb-4 font-['Playfair_Display']">Order Confirmed!</h1>
        <p className="text-gray-500 mb-10 max-w-md text-lg font-light">
          Thank you for choosing Leafin. Your green friends are being prepared with care and will be with you soon!
        </p>
        
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm mb-10 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] to-[#f4d03f]" />
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
            <span className="text-sm text-gray-500 uppercase tracking-wider">Order ID</span>
            <span className="font-mono font-bold text-[#2d5016]">#LF-{Math.floor(Math.random() * 100000)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 uppercase tracking-wider">Amount Paid</span>
            <span className="font-bold text-xl text-[#2d5016]">₹{total}</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="px-10 py-4 bg-[#2d5016] text-white rounded-full font-bold hover:bg-[#3d6622] transition-all w-full max-w-sm shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 lg:pb-12 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-6 py-6 flex items-center gap-4 border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-[#2d5016] font-['Playfair_Display']">Checkout</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Animated Progress Bar */}
        <div className="mb-12 max-w-3xl mx-auto">
          <div className="relative flex items-center justify-between">
            {/* Background Line */}
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10 rounded-full" />
            
            {/* Active Line Animation */}
            <div 
              className="absolute left-0 top-1/2 h-1 bg-[#2d5016] -z-10 rounded-full transition-all duration-500 ease-out"
              style={{ width: step === 'address' ? '0%' : step === 'payment' ? '50%' : '100%' }}
            />

            {/* Steps */}
            {[
              { id: 'address', label: 'Address', icon: MapPin },
              { id: 'payment', label: 'Payment', icon: CreditCard },
              { id: 'confirm', label: 'Confirm', icon: CheckCircle },
            ].map((s, index) => {
              const isActive = step === s.id || (step === 'payment' && index === 0);
              
              return (
                <div key={s.id} className="flex flex-col items-center gap-3 bg-neutral-50 px-4">
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${
                      isActive 
                        ? 'bg-[#2d5016] border-[#2d5016] text-white shadow-lg scale-110' 
                        : 'bg-white border-gray-200 text-gray-400'
                    }`}
                  >
                    <s.icon size={20} />
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                    isActive ? 'text-[#2d5016]' : 'text-gray-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="flex-1">
            {step === 'address' ? (
              <div className="space-y-6 animate-slide-up">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-[#2d5016] font-['Playfair_Display']">Shipping Address</h2>
                </div>

                {/* Saved Addresses */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border-2 border-[#2d5016] bg-[#2d5016]/5 p-5 rounded-2xl relative cursor-pointer transition-all">
                    <div className="absolute top-4 right-4 text-[#2d5016]">
                      <CheckCircle size={20} fill="currentColor" className="text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#2d5016] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">Home</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">John Doe</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      123 Green Street, Eco Valley,<br />
                      Nature City, Kerala 670001
                    </p>
                    <p className="text-sm text-gray-600 mt-2">+91 98765 43210</p>
                  </div>

                  {/* Add New Address Button */}
                  <button className="group border-2 border-dashed border-gray-300 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-[#2d5016] hover:text-[#2d5016] hover:bg-white transition-all duration-300 min-h-[180px]">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#2d5016] group-hover:text-white transition-colors duration-300">
                      <Plus size={24} />
                    </div>
                    <span className="font-bold">Add New Address</span>
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-6">Or enter a new address</h3>
                  <form className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">First Name</label>
                        <input type="text" className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium" defaultValue="John" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Last Name</label>
                        <input type="text" className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium" defaultValue="Doe" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Address</label>
                      <input type="text" className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium" defaultValue="123 Green Street" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">City</label>
                        <input type="text" className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium" defaultValue="Plant City" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">ZIP Code</label>
                        <input type="text" className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium" defaultValue="670001" />
                      </div>
                    </div>
                  </form>
                </div>

                <button
                  onClick={() => setStep('payment')}
                  className="w-full py-4 bg-[#2d5016] text-white rounded-xl font-bold text-lg hover:bg-[#3d6622] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                >
                  Continue to Payment
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-slide-up">
                <h2 className="text-2xl font-bold text-[#2d5016] font-['Playfair_Display']">Payment Method</h2>
                
                <div className="space-y-4">
                  {[
                    { id: 'upi', label: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
                    { id: 'card', label: 'Credit/Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                    { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                  ].map((method) => (
                    <label key={method.id} className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:border-[#2d5016] hover:shadow-md transition-all group">
                      <div className="relative flex items-center justify-center">
                        <input type="radio" name="payment" className="peer sr-only" defaultChecked={method.id === 'upi'} />
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-[#2d5016] peer-checked:bg-[#2d5016] transition-all relative">
                          <div className="absolute inset-0 m-auto w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-[#2d5016]/10 transition-colors">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-gray-900 block text-lg">{method.label}</span>
                        <span className="text-sm text-gray-500">{method.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#bfa040] text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-8"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      Pay Securely <span className="bg-white/20 px-2 py-0.5 rounded text-sm">₹{total}</span>
                    </>
                  )}
                </button>
                
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
                  <ShieldCheck size={14} />
                  <span>256-bit SSL Secure Payment</span>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-xl text-[#2d5016] mb-6 font-['Playfair_Display']">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#2d5016] mt-1">₹{item.product.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#2d5016]">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax (5%)</span>
                  <span className="font-semibold">₹{tax}</span>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-dashed border-gray-200">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-[#2d5016] font-['Playfair_Display']">₹{total}</span>
                </div>
              </div>

              {cartTotal < 499 && (
                <div className="mt-4 bg-amber-50 text-amber-800 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                  <Truck size={14} />
                  <span>Add <strong>₹{499 - cartTotal}</strong> more for free shipping</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
