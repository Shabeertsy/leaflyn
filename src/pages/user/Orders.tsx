import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import type { APIOrder } from '../../types';

const Orders: React.FC = () => {
  const { orders, isLoading, nextPage, fetchOrders, clearOrders } = useOrderStore();
  const [currentPage, setCurrentPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset page and fetch fresh orders on mount
    setCurrentPage(1);
    fetchOrders(1);
    
    // Cleanup on unmount
    return () => {
      clearOrders();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (nextPage && !isLoading) {
      const nextPageNum = currentPage + 1;
      setCurrentPage(nextPageNum);
      fetchOrders(nextPageNum);
    }
  }, [nextPage, isLoading, currentPage, fetchOrders]);

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

  const getStatusIcon = (status: APIOrder['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'shipped':
        return <Truck className="text-blue-600" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-600" size={20} />;
      case 'processing':
        return <Clock className="text-yellow-600" size={20} />;
      default:
        return <Package className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status: APIOrder['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'processing':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="pb-24 lg:pb-0 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/account" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-gray-700" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#2d5016] font-['Playfair_Display']">My Orders</h1>
              <p className="text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {isLoading && currentPage === 1 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5016]"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 font-['Playfair_Display']">
              No orders yet
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link
              to="/search"
              className="inline-block px-8 py-3 bg-[#2d5016] text-white rounded-full font-bold hover:bg-[#3d6622] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.uuid}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Order Header */}
                  <div className="p-4 border-b border-gray-100 bg-neutral-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Order #{order.order_number}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.created_at)}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="text-xs font-semibold capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {order.items.slice(0, 2).map((item: any) => (
                        <div key={item.uuid || item.id} className="flex gap-3">
                          <img
                            src={item.variant?.images?.[0]?.image || '/placeholder.png'}
                            alt={item.variant?.name || 'Product'}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm truncate">
                              {item.variant?.name || 'Product Item'}
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Qty: {item.quantity} × ₹{parseFloat(item.price).toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              ₹{item.total ? parseFloat(item.total).toFixed(2) : (parseFloat(item.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-gray-500 text-center py-2">
                          +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>

                    {/* Order Total */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">Total Amount</span>
                        <span className="text-lg font-bold text-[#2d5016]">₹{parseFloat(order.total || (order as any).total_amount).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/orders/${order.uuid}`}
                        className="flex-1 text-center px-4 py-2 bg-[#2d5016] text-white rounded-lg font-semibold hover:bg-[#3d6622] transition-colors text-sm"
                      >
                        View Details
                      </Link>
                      {order.status === 'delivered' && (
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm">
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {nextPage && (
              <div ref={observerTarget} className="mt-8 flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2d5016]"></div>
              </div>
            )}

            {/* End of Results */}
            {!nextPage && orders.length > 0 && (
              <div className="mt-8 text-center py-8">
                <p className="text-gray-500 font-medium">You've reached the end of your orders</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
