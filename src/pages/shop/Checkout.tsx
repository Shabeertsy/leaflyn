import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, CreditCard, MapPin, Plus, ShieldCheck, Truck, ChevronRight, Phone, Lock, Eye, EyeOff, Mail, X, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../lib/axios';
import OTPVerificationModal from '../../components/ui/OTPVerificationModal';
import TermsModal from '../../components/common/TermsModal';
import { useAddressStore } from '../../store/useAddressStore';

interface PaymentGateway {
  id: number;
  name: string;
  display_name: string;
  description: string;
  logo: string | null;
  is_default: boolean;
  min_amount: string;
  max_amount: string;
  features: {
    supports_refund: boolean;
    supports_upi: boolean;
    supports_cards: boolean;
    supports_netbanking: boolean;
    supports_wallets: boolean;
  };
  transaction_fee: {
    percentage: string;
    fixed: string;
  };
}

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  buildingName: string;
  place: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}


const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getCartTotal, syncLocalCartToBackend } = useCartStore();
  const { isAuthenticated, setUser } = useAuthStore();
  const { addresses, fetchAddresses, addAddress, isLoading: addressesLoading } = useAddressStore();
  const cartTotal = getCartTotal();
  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [orderSuccessData, setOrderSuccessData] = useState<{ order_id: string; total_amount: number } | null>(null);

  // OTP Verification State
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Payment State
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  // @ts-ignore
  const [selectedGateway, setSelectedGateway] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'gateway' | 'cod'>('gateway');
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  
  // Track if user started as guest to prevent UI flash
  const [isGuestFlow, setIsGuestFlow] = useState(false);

  // Terms and Conditions acceptance
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // New address form state
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    label: 'Home',
    name: '',
    phone: '',
    buildingName: '',
    place: '',
    city: '',
    district: '',
    state: '',
    pincode: ''
  });

  const shipping = cartTotal >= 499 ? 0 : 50;
  const tax = 0; // No tax applied
  const total = Number((cartTotal + shipping + tax).toFixed(2));

  // Fetch addresses for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated, fetchAddresses]);

  // Fetch gateways when entering payment step
  useEffect(() => {
    if (step === 'payment') {
      const fetchGateways = async () => {
        try {
          const response = await api.get('/pay/list/gateways/');
          
          if (response.data && response.data.gateways) {
            setGateways(response.data.gateways);
            if (response.data.gateways.length > 0) {
              setSelectedGateway(response.data.gateways[0].id);
            }
          }
        } catch (error) {
          console.error('Failed to fetch gateways', error);
        }
      };
      fetchGateways();
    }
  }, [step]);

  const handlePlaceOrder = async () => {
    // Check if terms are accepted
    if (!acceptedTerms) {
      alert('Please accept the Terms and Conditions to proceed');
      return;
    }

    if (paymentMethod === 'cod') {
      // Handle COD - Create order via API
      setLoading(true);
      
      // Get selected address
      const selectedAddress = addresses[selectedAddressIndex];
      
      if (!selectedAddress || !selectedAddress.uuid) {
        alert('Please select a shipping address');
        setLoading(false);
        return;
      }

      try {
        const response = await api.post('/api/order/cod/', {
          shipping_address_id: selectedAddress.uuid
        });

        console.log('COD Order created:', response.data);
        
        setOrderSuccessData({
          order_id: response.data.order_id || response.data.uuid || 'N/A',
          total_amount: response.data.total_amount || total
        });

        // Clear cart and show success
        setStep('success');
        clearCart();
      } catch (error: any) {
        console.error('COD order creation failed:', error);
        alert(error.response?.data?.error || 'Failed to place order. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Handle Gateway Payment
      if (gateways.length === 0) {
        // No gateways available
        alert('No payment gateways available. Please try again later.');
        return;
      } else if (gateways.length === 1) {
        // Auto-select single gateway and proceed
        setSelectedGateway(gateways[0].id);
        initiatePayment(gateways[0].id);
      } else {
        // Show modal to select gateway
        setShowGatewayModal(true);
      }
    }
  };

  const initiatePayment = async (gatewayId: number) => {
    setLoading(true);
    setShowGatewayModal(false);
    
    try {
      const response = await api.post('/pay/initiate/', {
        gateway_id: gatewayId,
        amount: total,
        // Add other necessary fields like order details if required by the backend
      });

      console.log('Payment initiated:', response.data);
      // Here you would typically redirect the user to the payment gateway URL provided in the response
      // For now, we'll simulate success
      setStep('success');
      clearCart();
    } catch (error) {
      console.error('Payment initiation failed', error);
      alert('Payment initiation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.place || !newAddress.city || !newAddress.pincode) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await addAddress({
        name: newAddress.name,
        phone: newAddress.phone,
        address_line_1: newAddress.place,
        address_line_2: newAddress.buildingName || '',
        city: newAddress.city,
        state: newAddress.state || '',
        country: 'India',
        pin_code: newAddress.pincode,
        is_default: addresses.length === 0
      });

      // Close modal and reset form
      setShowAddressModal(false);
      setSelectedAddressIndex(addresses.length); 
      setNewAddress({
        label: 'Home',
        name: '',
        phone: '',
        buildingName: '',
        place: '',
        city: '',
        district: '',
        state: '',
        pincode: ''
      });
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to add address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Send OTP to guest user's email
  const handleSendOTP = async () => {
    if (!email || !newAddress.name || !newAddress.phone || !newAddress.place || !newAddress.city || !newAddress.pincode || !password) {
      alert('Please fill in all required fields before proceeding');
      return;
    }

    setSendingOTP(true);
    try {
      await api.post('/api/send-otp/', { 
        contact: email, // Send OTP to email
        contact_type: 'email' // Specify that OTP should be sent via email
      });
      setShowOTPModal(true);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setSendingOTP(false);
    }
  };

  // Handle OTP verification success
  const handleOTPVerified = async (tokenData: { access: string; refresh: string; user: any }) => {
    setShowOTPModal(false);
    setIsGuestFlow(true); // Mark as guest flow to prevent UI flash
    
    // Store tokens from OTP verification
    localStorage.setItem('token', tokenData.access);
    localStorage.setItem('refreshToken', tokenData.refresh);
    
    // Update auth store with user data
    setUser(tokenData.user);
    
    // Sync local cart items to backend before proceeding
    try {
      await syncLocalCartToBackend();
    } catch (error) {
      console.error('Failed to sync cart, but continuing with checkout:', error);
    }
    
    // Register user address using the token
    await handleGuestRegistration();
  };

  // Register guest user with address (user already created by OTP verification)
  const handleGuestRegistration = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/register-user-address/', {
        full_name: newAddress.name,
        phone_number: newAddress.phone,
        email,
        password,
        building_name_number: newAddress.buildingName || '',
        place_street: newAddress.place,
        city: newAddress.city,
        district: newAddress.district || '',
        state: newAddress.state || '',
        pin_code: newAddress.pincode,
      });

      // Update user data from response
      setUser(response.data.user);

      // Refresh addresses to include the newly created one
      await fetchAddresses();
      setSelectedAddressIndex(0);

      // Proceed to payment
      setStep('payment');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to add address. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  // Touch/Swipe handling for address slider
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && selectedAddressIndex < addresses.length - 1) {
      setSelectedAddressIndex(selectedAddressIndex + 1);
    }
    if (isRightSwipe && selectedAddressIndex > 0) {
      setSelectedAddressIndex(selectedAddressIndex - 1);
    }
  };

  const scrollAddresses = (direction: 'left' | 'right') => {
    if (direction === 'left' && selectedAddressIndex > 0) {
      setSelectedAddressIndex(selectedAddressIndex - 1);
    } else if (direction === 'right' && selectedAddressIndex < addresses.length - 1) {
      setSelectedAddressIndex(selectedAddressIndex + 1);
    }
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
          Thank you for choosing Leaflyn. Your green friends are being prepared with care and will be with you soon!
        </p>
        
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm mb-10 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#d4af37] to-[#f4d03f]" />
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
            <span className="text-sm text-gray-500 uppercase tracking-wider">Order ID</span>
            <span className="font-mono font-bold text-[#2d5016]">
              {orderSuccessData?.order_id || `#LF-${Math.floor(Math.random() * 100000)}`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 uppercase tracking-wider">Amount Paid</span>
            <span className="font-bold text-xl text-[#2d5016]">
              ₹{orderSuccessData?.total_amount || total}
            </span>
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
        {/* Progress Bar */}
        <div className="mb-12 max-w-3xl mx-auto">
          <div className="relative flex items-center justify-between px-4">
            {/* Background Line - connects through center of circles */}
            <div 
              className="absolute h-2 rounded-full overflow-hidden" 
              style={{ 
                top: '28px',
                zIndex: 1,
                left: '28px',
                right: '28px'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
            </div>
            
            {/* Active Progress Line - Animated gradient with glow */}
            <div 
              className="absolute h-2 rounded-full transition-all duration-700 ease-out overflow-hidden"
              style={{ 
                top: '28px',
                left: '28px',
                width: step === 'address' ? '0%' : step === 'payment' ? 'calc(50% - 28px)' : 'calc(100% - 56px)',
                zIndex: 2,
                boxShadow: '0 0 20px rgba(45, 80, 22, 0.4)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#2d5016] via-[#3d6622] to-[#2d5016] animate-pulse" />
              {/* Shimmer effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                style={{
                  animation: 'shimmer 2s infinite',
                  backgroundSize: '200% 100%'
                }}
              />
            </div>

            {[
              { id: 'address', label: 'Address', icon: MapPin },
              { id: 'payment', label: 'Payment', icon: CreditCard },
              { id: 'confirm', label: 'Confirm', icon: CheckCircle },
            ].map((s) => {
              const stepOrder = { address: 0, payment: 1, confirm: 2 };
              const currentStepOrder = stepOrder[step as keyof typeof stepOrder];
              const thisStepOrder = stepOrder[s.id as keyof typeof stepOrder];
              const isCompleted = currentStepOrder > thisStepOrder;
              const isActive = step === s.id;
              
              return (
                <div key={s.id} className="flex flex-col items-center gap-3 relative z-10">
                  {/* Circle is 56px (14 * 4), so center is at 28px */}
                  <div 
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-[#2d5016] to-[#3d6622] border-[#2d5016] text-white shadow-lg shadow-[#2d5016]/30'
                        : isActive 
                        ? 'bg-gradient-to-br from-[#2d5016] to-[#3d6622] border-[#2d5016] text-white shadow-xl shadow-[#2d5016]/50 scale-110 animate-pulse' 
                        : 'bg-white border-gray-300 text-gray-400 shadow-md'
                    }`}
                  >
                    {isCompleted ? <CheckCircle size={22} fill="currentColor" /> : <s.icon size={22} />}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                    isCompleted || isActive ? 'text-[#2d5016] scale-105' : 'text-gray-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add shimmer animation to global styles */}
        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="flex-1">
            {step === 'address' ? (
              <div className="space-y-6 animate-slide-up">
                <h2 className="text-2xl font-bold text-[#2d5016] font-['Playfair_Display']">Shipping Address</h2>

                {/* For Authenticated Users: Show Address Slider */}
                {isAuthenticated && !isGuestFlow && (
                  <>
                    {/* Address Slider */}
                    {addressesLoading ? (
                      <div className="animate-pulse">
                        <div className="h-40 bg-gray-200 rounded-2xl"></div>
                      </div>
                    ) : addresses.length > 0 ? (
                      <div className="relative">
                        <div 
                          className="overflow-hidden rounded-2xl select-none"
                          style={{ touchAction: 'pan-y pinch-zoom' }}
                          onTouchStart={onTouchStart}
                          onTouchMove={onTouchMove}
                          onTouchEnd={onTouchEnd}
                        >
                          <div 
                            className="flex transition-transform duration-300 ease-out"
                            style={{ transform: `translateX(-${selectedAddressIndex * 100}%)` }}
                          >
                            {addresses.map((address, index) => (
                              <div
                                key={address.uuid}
                                className="min-w-full flex-shrink-0 px-1"
                              >
                                <div
                                  className={`border-2 p-4 sm:p-5 rounded-2xl cursor-pointer transition-all ${
                                    index === selectedAddressIndex
                                      ? 'border-[#2d5016] bg-[#2d5016]/5 shadow-md'
                                      : 'border-gray-200 bg-white'
                                  }`}
                                  onClick={() => setSelectedAddressIndex(index)}
                                >
                                  {/* Header */}
                                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                                    <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                                      address.isDefault
                                        ? 'bg-[#2d5016] text-white'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {address.isDefault ? 'Default' : 'Address'}
                                    </span>
                                    {index === selectedAddressIndex && (
                                      <div className="flex items-center gap-1.5 text-[#2d5016]">
                                        <div className="w-5 h-5 rounded-full bg-[#2d5016] flex items-center justify-center">
                                          <CheckCircle size={14} className="text-white" fill="currentColor" />
                                        </div>
                                        <span className="text-xs font-semibold hidden sm:inline">Selected</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Address Content */}
                                  <div className="space-y-2">
                                    <h3 className="font-bold text-gray-900 text-base sm:text-lg">{address.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                      {address.addressLine1}
                                      {address.addressLine2 && `, ${address.addressLine2}`}
                                      <br />
                                      {address.city}, {address.state} - {address.pincode}
                                      {address.country && `, ${address.country}`}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500 font-medium pt-1">
                                      📞 {address.phone}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Navigation Dots - Always visible for better UX */}
                        {addresses.length > 1 && (
                          <div className="flex justify-center gap-2 mt-4">
                            {addresses.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedAddressIndex(index)}
                                className={`transition-all duration-300 rounded-full ${
                                  index === selectedAddressIndex
                                    ? 'w-8 h-2 bg-[#2d5016]'
                                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                                }`}
                                aria-label={`Select address ${index + 1}`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Arrow Navigation - Hidden on mobile, visible on desktop */}
                        {addresses.length > 1 && (
                          <>
                            <button
                              onClick={() => scrollAddresses('left')}
                              disabled={selectedAddressIndex === 0}
                              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white border-2 border-gray-200 rounded-full items-center justify-center hover:border-[#2d5016] hover:bg-[#2d5016] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg z-10"
                            >
                              <ChevronLeftIcon size={20} />
                            </button>
                            <button
                              onClick={() => scrollAddresses('right')}
                              disabled={selectedAddressIndex === addresses.length - 1}
                              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white border-2 border-gray-200 rounded-full items-center justify-center hover:border-[#2d5016] hover:bg-[#2d5016] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg z-10"
                            >
                              <ChevronRightIcon size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    ) : null}

                    {/* Add Address Button for Authenticated Users */}
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="group w-full border-2 border-dashed border-gray-300 p-5 rounded-2xl flex items-center justify-center gap-3 text-gray-400 hover:border-[#2d5016] hover:text-[#2d5016] hover:bg-white transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#2d5016] group-hover:text-white transition-colors duration-300">
                        <Plus size={20} />
                      </div>
                      <span className="font-bold">Add New Address</span>
                    </button>
                  </>
                )}

                {/* For Guest Users: Show Inline Address Form */}
                {(!isAuthenticated || isGuestFlow) && (
                  <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm ${isGuestFlow ? 'opacity-70 pointer-events-none' : ''}`}>
                    <h3 className="font-bold text-gray-900 mb-6">Delivery Address</h3>
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name *</label>
                          <input
                            type="text"
                            value={newAddress.name}
                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                            className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number *</label>
                          <input
                            type="tel"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                            className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                            placeholder="+91 98765 43210"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Building Name/Number</label>
                        <input
                          type="text"
                          value={newAddress.buildingName}
                          onChange={(e) => setNewAddress({ ...newAddress, buildingName: e.target.value })}
                          className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                          placeholder="Green Villa, Apt 301"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Place/Street *</label>
                        <input
                          type="text"
                          value={newAddress.place}
                          onChange={(e) => setNewAddress({ ...newAddress, place: e.target.value })}
                          className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                          placeholder="123 Green Street"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">City *</label>
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                            placeholder="Eco Valley"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">District</label>
                          <input
                            type="text"
                            value={newAddress.district}
                            onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                            className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                            placeholder="Nature District"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">State</label>
                          <input
                            type="text"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                            placeholder="Kerala"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">PIN Code *</label>
                          <input
                            type="text"
                            value={newAddress.pincode}
                            onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                            className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                            placeholder="670001"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Guest Contact - Now appears after address form */}
                {(!isAuthenticated || isGuestFlow) && (
                  <div className={`bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-200 shadow-sm ${isGuestFlow ? 'opacity-70 pointer-events-none' : ''}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                        <Phone size={16} className="text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900">Contact Information</h3>
                      <span className="ml-auto text-xs bg-amber-500 text-white px-2 py-1 rounded-full font-bold">Required</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-5">We'll use these details to keep you updated about your order</p>
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                          <Mail size={12} />
                          Email Address
                        </label>
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3.5 bg-white rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-0 transition-colors outline-none font-medium" 
                          placeholder="john@example.com"
                          required
                        />
                      </div>


                      
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                          <Lock size={12} />
                          Create Password
                        </label>
                        <div className="relative">
                          <input 
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3.5 pr-12 bg-white rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:ring-0 transition-colors outline-none font-medium" 
                            placeholder="Create a secure password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">This will be used to create your account for easy tracking</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (isAuthenticated && !isGuestFlow) {
                      setStep('payment');
                    } else {
                      // Guest checkout - send OTP
                      handleSendOTP();
                    }
                  }}
                  disabled={sendingOTP || loading || isGuestFlow}
                  className="w-full py-4 bg-[#2d5016] text-white rounded-xl font-bold text-lg hover:bg-[#3d6622] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {sendingOTP || isGuestFlow ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                      {isGuestFlow ? 'Verifying & Registering...' : 'Sending OTP...'}
                    </>
                  ) : (
                    <>
                      {isAuthenticated ? 'Continue to Payment' : 'Verify & Continue'}
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-slide-up">
                <h2 className="text-2xl font-bold text-[#2d5016] font-['Playfair_Display']">Payment Method</h2>
                
                <div className="space-y-4">
                  {/* Online Payment / Gateways */}
                  <div className={`bg-white border-2 rounded-2xl overflow-hidden shadow-md transition-all ${paymentMethod === 'gateway' ? 'border-[#2d5016]' : 'border-gray-200'}`}>
                    <label className="flex items-center gap-4 p-5 cursor-pointer" onClick={() => setPaymentMethod('gateway')}>
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="radio" 
                          name="payment" 
                          className="peer sr-only" 
                          checked={paymentMethod === 'gateway'}
                          onChange={() => setPaymentMethod('gateway')}
                        />
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-[#2d5016] peer-checked:bg-[#2d5016] transition-all relative">
                          <div className="absolute inset-0 m-auto w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-[#2d5016]/10 rounded-xl flex items-center justify-center text-2xl">
                        📱
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-gray-900 block text-lg">Online Payment</span>
                        <span className="text-sm text-gray-500">UPI, Cards, Netbanking</span>
                      </div>
                    </label>
                  </div>

                  {/* Cash on Delivery */}
                  <label className={`flex items-center gap-4 p-5 bg-white border-2 rounded-2xl cursor-pointer hover:shadow-md transition-all group ${paymentMethod === 'cod' ? 'border-[#2d5016]' : 'border-gray-200'}`} onClick={() => setPaymentMethod('cod')}>
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        name="payment" 
                        className="peer sr-only" 
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                      />
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-[#2d5016] peer-checked:bg-[#2d5016] transition-all relative">
                        <div className="absolute inset-0 m-auto w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-[#2d5016]/10 transition-colors">
                      💵
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-gray-900 block text-lg">Cash on Delivery</span>
                      <span className="text-sm text-gray-500">Pay when you receive</span>
                    </div>
                  </label>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="mt-6 mb-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" 
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="peer sr-only" 
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-[#2d5016] peer-checked:bg-[#2d5016] transition-all flex items-center justify-center">
                        {acceptedTerms && (
                          <CheckCircle size={14} className="text-white" fill="currentColor" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-600 leading-relaxed">
                      I agree to the{' '}
                      <button 
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-[#2d5016] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer inline"
                      >
                        Terms and Conditions
                      </button>
                      {' '}and understand the order policies
                    </span>
                  </label>
                  {!acceptedTerms && (
                    <p className="text-xs text-amber-600 mt-2 ml-8">
                      * Please accept the terms to proceed with your order
                    </p>
                  )}
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || addressesLoading || !acceptedTerms}
                  className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#bfa040] text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      {paymentMethod === 'cod' ? 'Place Order' : 'Pay Securely'} <span className="bg-white/20 px-2 py-0.5 rounded text-sm">₹{total}</span>
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

          {/* Order Summary - Only show for authenticated users */}
          {isAuthenticated && (
            <div className="lg:w-96 animate-in slide-in-from-right duration-500">
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
                        <p className="text-sm font-bold text-[#2d5016] mt-1 font-sans">₹{item.product.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold font-sans">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-[#2d5016] font-sans">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span className="font-semibold font-sans">₹{tax}</span>
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-dashed border-gray-200">
                    <span className="font-bold text-gray-900">Total Amount</span>
                    <span className="text-xl md:text-2xl font-bold text-[#2d5016] font-sans tracking-wide">₹{total}</span>
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
          )}
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#2d5016] font-['Playfair_Display']">Add New Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Address Label</label>
                <select
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Name *</label>
                  <input
                    type="text"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone Number *</label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Building Name/Number</label>
                <input
                  type="text"
                  value={newAddress.buildingName}
                  onChange={(e) => setNewAddress({ ...newAddress, buildingName: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                  placeholder="Green Villa, Apt 301"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Place/Street *</label>
                <input
                  type="text"
                  value={newAddress.place}
                  onChange={(e) => setNewAddress({ ...newAddress, place: e.target.value })}
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                  placeholder="123 Green Street"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">City *</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                    placeholder="Eco Valley"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">District</label>
                  <input
                    type="text"
                    value={newAddress.district}
                    onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                    className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                    placeholder="Nature District"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">State</label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                    placeholder="Kerala"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">PIN Code *</label>
                  <input
                    type="text"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-[#2d5016] focus:ring-0 transition-colors outline-none font-medium"
                    placeholder="670001"
                    required
                  />
                </div>
              </div>

              <button
                onClick={handleSaveAddress}
                disabled={loading}
                className="w-full py-4 bg-[#2d5016] text-white rounded-xl font-bold text-lg hover:bg-[#3d6622] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    Saving...
                  </>
                ) : (
                  'Save Address'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gateway Selection Modal */}
      {showGatewayModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#2d5016] font-['Playfair_Display']">Select Payment Gateway</h3>
              <button
                onClick={() => setShowGatewayModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-4">Choose your preferred payment partner to continue</p>
              
              {gateways.map((gateway) => (
                <button
                  key={gateway.id}
                  onClick={() => {
                    setSelectedGateway(gateway.id);
                    initiatePayment(gateway.id);
                  }}
                  className="w-full p-5 border-2 border-gray-200 rounded-xl hover:border-[#2d5016] hover:bg-[#2d5016]/5 transition-all flex items-center gap-4 group"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl group-hover:bg-white transition-colors">
                    {gateway.logo ? (
                      <img src={gateway.logo} alt={gateway.display_name} className="w-full h-full object-contain p-2" />
                    ) : (
                      <span>🏦</span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-bold text-gray-900 mb-1">{gateway.display_name}</h4>
                    <p className="text-xs text-gray-500">{gateway.description}</p>
                    <div className="flex gap-2 mt-2">
                      {gateway.features.supports_upi && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">UPI</span>
                      )}
                      {gateway.features.supports_cards && (
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">Cards</span>
                      )}
                      {gateway.features.supports_netbanking && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Net Banking</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-[#2d5016] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <OTPVerificationModal
          email={email}
          onVerified={handleOTPVerified}
          onClose={() => setShowOTPModal(false)}
        />
      )}
      {/* Terms and Conditions Modal */}
      <TermsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
      />
    </div>
  );
};

export default Checkout;
