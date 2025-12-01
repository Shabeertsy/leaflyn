import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const Register: React.FC = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  // const from = location.state?.from?.pathname || '/';
  const { register, verifyOtp, resendOtp, sendOtp } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      await resendOtp(email);
      setTimer(120); // 2 minutes
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length !== 8) {
      setError('Password must be exactly 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      // If successful, send OTP and show modal
      await sendOtp(email);
      setShowOtpModal(true);
      setTimer(120); // Start timer
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyOtp(email, otp);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).replace(/[^0-9]/g, '');
    if (pastedData) {
      setOtp(pastedData);
      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedData.length, 5);
      document.getElementById(`otp-${nextIndex}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative">
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <div className="flex items-center justify-center gap-2">
                <div className="w-10 h-10 bg-[#2d5016] rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">L</span>
                </div>
                <span className="text-2xl font-bold text-[#2d5016] font-['Playfair_Display']">Leaflyn</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-['Playfair_Display']">Create Account</h1>
            <p className="text-gray-500">Join our community of plant lovers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && !showOtpModal && (
              <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#2d5016] focus:ring-0 outline-none transition-all font-medium"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#2d5016] focus:ring-0 outline-none transition-all font-medium"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#2d5016] focus:ring-0 outline-none transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {/* Show live error if password is not 8 chars */}
              {(password.length > 0 && password.length !== 8) && (
                <p className="text-red-500 text-xs mt-1 ml-2">Password must be exactly 8 characters.</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#2d5016] focus:ring-0 outline-none transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="terms" className="rounded text-[#2d5016] focus:ring-[#2d5016]" required />
              <label htmlFor="terms" className="text-sm text-gray-500">
                I agree to the <Link to="/terms" className="text-[#2d5016] font-semibold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#2d5016] font-semibold hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2d5016] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#3d6622] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#2d5016] hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* OTP Modal */}
        {showOtpModal && (
          <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <div className="w-full max-w-sm text-center">
              <div className="w-16 h-16 bg-[#2d5016]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={32} className="text-[#2d5016]" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-['Playfair_Display']">Verify Your Email</h2>
              <p className="text-gray-500 mb-8">
                We've sent a verification code to <br/>
                <span className="font-semibold text-gray-900">{email}</span>
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {error && (
                  <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide block text-left">Enter OTP</label>
                  <div className="flex gap-2 justify-between">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={otp[index] || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/[^0-9]/.test(value)) return;
                          
                          const newOtp = otp.split('');
                          newOtp[index] = value;
                          const newOtpString = newOtp.join('');
                          setOtp(newOtpString);

                          if (value && index < 5) {
                            document.getElementById(`otp-${index + 1}`)?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otp[index] && index > 0) {
                            document.getElementById(`otp-${index - 1}`)?.focus();
                          }
                        }}
                        onPaste={handlePaste}
                        className="w-12 h-14 text-center text-xl font-bold border border-gray-200 rounded-xl focus:border-[#2d5016] focus:ring-0 outline-none transition-all bg-gray-50"
                        required={index === 0}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-[#2d5016] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#3d6622] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    'Verify Email'
                  )}
                </button>

                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend code in <span className="font-bold text-[#2d5016]">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-sm font-bold text-[#2d5016] hover:underline disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
