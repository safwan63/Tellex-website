import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { 
  Package, 
  ChevronLeft, 
  X, 
  Calendar, 
  MapPin, 
  Tag, 
  Clock, 
  CreditCard 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Order {
  id: string;
  userId: string;
  type: 'mystery' | 'vibe';
  status: 'confirmed' | 'cancelled' | 'delivered';
  mood: string;
  address: string;
  price: number;
  createdAt: Timestamp;
  delivery?: any;
}

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch Orders
  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    const ordersCol = collection(db, "orders");
    const q = query(
      ordersCol,
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        
        // Sort locally by createdAt descending to avoid index requirement
        const sortedOrders = ordersData.sort((a, b) => {
          const timeA = a.createdAt?.toMillis() || 0;
          const timeB = b.createdAt?.toMillis() || 0;
          return timeB - timeA;
        });

        setOrders(sortedOrders);
        setLoading(false);
      } catch (err) {
        console.error("Mapping error:", err);
      }
    }, (error) => {
      console.error("Firestore snapshot error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleCancelOrder = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status: "cancelled" });
        
        // Update local selected state if open
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: "cancelled" } : null);
        }
      } catch (err) {
        console.error("Error cancelling order:", err);
        alert("Failed to cancel order. Please try again.");
      }
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'confirmed': return { color: '#2d6a4f', bg: '#f0fdf4' };
      case 'cancelled': return { color: '#e53e3e', bg: '#fff5f5' };
      case 'delivered': return { color: '#3182ce', bg: '#ebf8ff' };
      default: return { color: '#4a5568', bg: '#f7fafc' };
    }
  };

  const getDeliveryRange = (createdAt: Timestamp) => {
    if (!createdAt) return "TBD";
    const date = createdAt.toDate();
    const start = new Date(date);
    start.setDate(start.getDate() + 4);
    const end = new Date(date);
    end.setDate(end.getDate() + 7);

    // Manual adjustment to match user's format
    const formatPart = (d: Date) => {
      const day = d.getDate();
      const month = d.toLocaleString('en-GB', { month: 'short' });
      return `${day} ${month}`;
    };

    return `${formatPart(start)} - ${formatPart(end)}`;
  };

  if (authLoading || (loading && !orders.length)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF7]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0E462B]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF7] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FDFCF7]/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8">Ready to start your book mystery?</p>
            <Link 
              to="/flow" 
              className="px-8 py-3 bg-[#0E462B] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start Discovery
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const styles = getStatusStyles(order.status);
              return (
                <motion.div
                  layoutId={order.id}
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          {order.type === 'mystery' ? '🎁 Mystery Pick' : '✨ Vibe Pick'}
                        </span>
                      </div>
                      <h3 className="text-sm font-mono text-gray-500">ID: #{order.id.slice(0, 8).toUpperCase()}</h3>
                    </div>
                    <span 
                      className="px-3 py-1 rounded-full text-[12px] font-bold uppercase"
                      style={{ color: styles.color, backgroundColor: styles.bg }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      {order.type === 'vibe' ? (
                        <>
                          <Clock className="w-4 h-4 text-[#3182ce]" />
                          <span className="font-semibold text-[#2c5282]">Ready within 24 hrs</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>Est. Delivery: <span className="font-semibold text-gray-900">{getDeliveryRange(order.createdAt)}</span></span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Tag className="w-4 h-4" />
                      <span className="capitalize">{order.type} Pick</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-lg font-bold text-[#0E462B]">₹{order.price}</span>
                    {order.status === 'confirmed' && (
                      <button
                        onClick={(e) => handleCancelOrder(e, order.id)}
                        className="text-xs font-bold text-red-500 hover:underline px-2 py-1"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Bottom Sheet Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-[32px] z-50 overflow-hidden shadow-2xl max-w-xl mx-auto"
              style={{ maxHeight: "85vh" }}
            >
              <div className="relative p-6 px-8">
                {/* Drag Handle */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full" />
                
                <div className="flex justify-between items-start mt-4 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Order Summary</h2>
                    <p className="text-sm font-mono text-gray-500 tracking-tight">#{selectedOrder.id.toUpperCase()}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-8 overflow-y-auto pb-10" style={{ maxHeight: "calc(85vh - 120px)" }}>
                  {/* Status & Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Pick Type</p>
                      <p className="font-bold text-[#0E462B]">
                        {selectedOrder.type === 'mystery' ? '🎁 Mystery Pick' : '✨ Vibe Pick'}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: getStatusStyles(selectedOrder.status).bg }}>
                      <p className="text-[10px] uppercase font-bold opacity-60 mb-1">Status</p>
                      <p className="font-bold text-lg uppercase tracking-wider" style={{ color: getStatusStyles(selectedOrder.status).color }}>
                        {selectedOrder.status}
                      </p>
                    </div>
                  </div>

                  {/* Date & Delivery */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#0E462B]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-[#0E462B]" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Ordered On</p>
                        <p className="text-gray-900 font-medium">
                          {selectedOrder.createdAt?.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#0E462B]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                        {selectedOrder.type === 'vibe' ? <Clock className="w-5 h-5 text-[#3182ce]" /> : <Calendar className="w-5 h-5 text-[#0E462B]" />}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                          {selectedOrder.type === 'vibe' ? 'Preparation Status' : 'Estimated Delivery'}
                        </p>
                        <p className={selectedOrder.type === 'vibe' ? "text-[#2c5282] font-bold text-lg" : "text-[#0E462B] font-bold text-lg"}>
                          {selectedOrder.type === 'vibe' ? 'Ready within 24 hrs' : getDeliveryRange(selectedOrder.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#0E462B]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-[#0E462B]" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Delivery Address</p>
                        <p className="text-gray-700 text-sm leading-relaxed max-w-[280px]">
                          {selectedOrder.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price & Payment */}
                  <div className="flex items-center justify-between p-6 bg-[#0E462B] rounded-2xl text-[#e1cfbc]">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6" />
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-60">Payment Method</p>
                        <p className="text-sm font-bold">Cash on Delivery (COD)</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase opacity-60">Total Amount</p>
                      <p className="text-2xl font-bold text-white">₹{selectedOrder.price}</p>
                    </div>
                  </div>

                  {/* Cancel Button in Modal */}
                  {selectedOrder.status === 'confirmed' && (
                    <button
                      onClick={(e) => handleCancelOrder(e, selectedOrder.id)}
                      className="w-full py-4 text-red-500 font-bold border-2 border-red-50 rounded-2xl hover:bg-red-50 transition-colors"
                    >
                      Cancel This Order
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
