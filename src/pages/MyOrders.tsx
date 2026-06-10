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
  CreditCard,
  MessageCircle,
  Truck,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Order {
  id: string;
  userId: string;
  type: 'mystery' | 'vibe';
  status: 'confirmed' | 'cancelled' | 'delivered' | 'pending';
  mood: string;
  address: string;
  price: number;
  createdAt: Timestamp;
  delivery?: any;
  bookQuantity?: string;
  answers?: any;
  budget?: number;
  cancellationReason?: string;
  shipmentCreated?: boolean;
  awbCode?: string;
  courierName?: string;
  trackingUrl?: string;
  shipmentStatus?: string;
  shippedAt?: Timestamp;
  deliveredAt?: Timestamp;
  estimatedDeliveryDate?: Timestamp;
}

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    pincode: "",
    whatsapp: ""
  });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

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
        setError("We couldn't format your orders correctly. This might be a temporary permission issue.");
        setLoading(false);
      }
    }, (error) => {
      console.error("Firestore snapshot error:", error);
      setError("Failed to connect to our database. This usually means a connection issue or a missing permission (white screen catch).");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleCancelOrder = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    setCancellingOrderId(orderId);
    setCancellationReason("");
    setShowCancelModal(true);
  };

  const submitCancellation = async () => {
    if (!cancellingOrderId || !cancellationReason.trim()) return;
    
    setIsCancelling(true);
    try {
      const orderRef = doc(db, "orders", cancellingOrderId);
      await updateDoc(orderRef, { 
        status: "cancelled",
        cancellationReason: cancellationReason.trim()
      });
      
      // Update local selected state if open
      if (selectedOrder?.id === cancellingOrderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: "cancelled", cancellationReason: cancellationReason.trim() } : null);
      }
      
      setShowCancelModal(false);
      setCancellingOrderId(null);
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const startEditing = (order: Order) => {
    setEditData({
      firstName: order.delivery?.firstName || "",
      lastName: order.delivery?.lastName || "",
      address: order.delivery?.address || order.address.split(',')[1]?.trim() || order.address,
      city: order.delivery?.city || "",
      pincode: order.delivery?.pincode || "",
      whatsapp: order.delivery?.whatsapp || ""
    });
    setIsEditing(true);
  };

  const handleUpdateAddress = async () => {
    if (!selectedOrder) return;
    setIsSaving(true);
    try {
      const orderRef = doc(db, "orders", selectedOrder.id);
      const fullAddress = `${editData.firstName} ${editData.lastName}, ${editData.address}, ${editData.city} - ${editData.pincode}`;
      
      const updatePayload = {
        delivery: {
          ...selectedOrder.delivery,
          ...editData
        },
        address: fullAddress
      };

      await updateDoc(orderRef, updatePayload);
      setSelectedOrder({
        ...selectedOrder,
        ...updatePayload
      });
      setIsEditing(false);
    } catch (err: any) {
      console.error("Error updating address:", err);
      // More descriptive error for debugging (removed in production usually, but helpful here)
      const errorMsg = err.code === 'permission-denied' 
        ? "Access Denied: Please update your Firestore Security Rules." 
        : "Failed to update address. Please try again.";
      alert(errorMsg);
    } finally {
      setIsSaving(false);
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

  const getBookQuantity = (order: Order) => {
    const qty = order.answers?.bookQuantity || order.bookQuantity || order.delivery?.bookQuantity;
    if (!qty) return 1;
    const parsed = parseInt(String(qty).replace(/\D/g, ''));
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  };

  const formatDateTime = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate();
    return date.toLocaleString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const VALID_BUDGETS = [349, 449, 689, 1299];

  const snapToValidBudget = (value: number) => {
    return VALID_BUDGETS.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  };

  const getBudgetPerBook = (order: Order) => {
    // Priority 1: explicitly saved top-level budget field (new orders)
    if (order.budget && order.budget > 0) return order.budget;
    // Priority 2: budget saved inside answers (new orders)
    if (order.answers?.budget && order.answers.budget > 0) return order.answers.budget;
    // Priority 3: for legacy orders, snap stored price/qty to nearest valid option
    // (prevents garbage values like ₹116 from division of wrong legacy prices)
    if (order.price && order.price > 0) {
      const qty = getBookQuantity(order);
      const derived = Math.round(order.price / qty);
      return snapToValidBudget(derived);
    }
    return 349; // absolute last resort
  };

  const getDisplayPrice = (order: Order) => {
    const qty = getBookQuantity(order);
    return getBudgetPerBook(order) * qty;
  };

  const getTrackingSteps = (order: Order) => {
    const isCancelled = order.status === 'cancelled';
    const s = order.shipmentStatus || '';
    const isDelivered = s === 'Delivered' || order.status === 'delivered';
    const isOut = isDelivered || s === 'Out For Delivery';
    const isTransit = isOut || s === 'In Transit';
    const isPicked = isTransit || s === 'Picked Up';
    const isPacked = isPicked || s === 'Packed';
    
    return [
      { id: 'confirmed', label: 'Order Confirmed', icon: CheckCircle, isCompleted: !isCancelled },
      { id: 'curated', label: 'Book Curated', icon: Package, isCompleted: !!order.shipmentCreated },
      { id: 'packed', label: 'Packed', icon: Package, isCompleted: isPacked },
      { id: 'picked_up', label: 'Picked Up', icon: Truck, isCompleted: isPicked },
      { id: 'transit', label: 'In Transit', icon: Truck, isCompleted: isTransit },
      { id: 'out', label: 'Out For Delivery', icon: Truck, isCompleted: isOut },
      { id: 'delivered', label: 'Delivered', icon: Package, isCompleted: isDelivered }
    ];
  };

  if (authLoading || (loading && !orders.length && !error)) {
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
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-8 py-3 bg-[#0E462B] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Reload Page
            </button>
          </div>
        ) : orders.length === 0 ? (
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
                    <div className="flex items-center gap-3 text-sm text-gray-600 border-b border-gray-50 pb-3 mb-2">
                      <Clock className="w-4 h-4" />
                      <span>Placed on: <span className="font-semibold text-gray-900">{formatDateTime(order.createdAt)}</span></span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
                      {order.type === 'vibe' ? (
                        <>
                          <Tag className="w-4 h-4 text-[#3182ce]" />
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
                      <Package className="w-4 h-4" />
                      <span className="capitalize">{order.type} Pick • {getBookQuantity(order)} {getBookQuantity(order) === 1 ? 'Book' : 'Books'}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-[#0E462B]">₹{getDisplayPrice(order)}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">₹{getBudgetPerBook(order)} each</span>
                    </div>
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
              onClick={() => { setSelectedOrder(null); setIsEditing(false); }}
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
                    onClick={() => { setSelectedOrder(null); setIsEditing(false); }}
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
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Quantity</p>
                      <p className="font-bold text-[#0E462B]">
                        {getBookQuantity(selectedOrder)} {getBookQuantity(selectedOrder) === 1 ? 'Book' : 'Books'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Price/Book</p>
                      <p className="font-bold text-[#0E462B]">
                        ₹{getBudgetPerBook(selectedOrder)}
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
                          {formatDateTime(selectedOrder.createdAt)}
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
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Delivery Address</p>
                          {!isEditing && selectedOrder.status === 'confirmed' && (
                            <button 
                              onClick={() => startEditing(selectedOrder)}
                              className="text-[11px] font-bold text-[#0E462B] hover:underline"
                            >
                              Edit Address
                            </button>
                          )}
                        </div>
                        
                        {isEditing ? (
                          <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="grid grid-cols-2 gap-2">
                              <input 
                                value={editData.firstName} 
                                onChange={e => setEditData({...editData, firstName: e.target.value})}
                                placeholder="First Name" 
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-[#0E462B] outline-none"
                              />
                              <input 
                                value={editData.lastName} 
                                onChange={e => setEditData({...editData, lastName: e.target.value})}
                                placeholder="Last Name" 
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-[#0E462B] outline-none"
                              />
                            </div>
                            <textarea 
                              value={editData.address} 
                              onChange={e => setEditData({...editData, address: e.target.value})}
                              placeholder="Full Address" 
                              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-[#0E462B] outline-none h-16 resize-none"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input 
                                value={editData.city} 
                                onChange={e => setEditData({...editData, city: e.target.value})}
                                placeholder="City" 
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-[#0E462B] outline-none"
                              />
                              <input 
                                value={editData.pincode} 
                                onChange={e => setEditData({...editData, pincode: e.target.value})}
                                placeholder="Pincode" 
                                maxLength={6}
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-[#0E462B] outline-none"
                              />
                            </div>
                            <input 
                              value={editData.whatsapp} 
                              onChange={e => setEditData({...editData, whatsapp: e.target.value})}
                              placeholder="WhatsApp Number" 
                              maxLength={10}
                              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-[#0E462B] outline-none"
                            />
                            <div className="flex gap-2 pt-2">
                              <button 
                                onClick={() => setIsEditing(false)}
                                className="flex-1 py-2 text-xs font-bold text-gray-500 border border-gray-200 rounded-lg"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={handleUpdateAddress}
                                disabled={isSaving}
                                className="flex-1 py-2 text-xs font-bold text-white bg-[#0E462B] rounded-lg disabled:opacity-50"
                              >
                                {isSaving ? "Saving..." : "Save Address"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 text-sm leading-relaxed max-w-[280px]">
                            {selectedOrder.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amazon-like Tracking Timeline */}
                  {selectedOrder.status !== 'cancelled' && (
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Order Tracking</h3>
                      
                      {selectedOrder.shipmentCreated && (
                        <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Courier</p>
                            <p className="font-bold text-[#0E462B]">{selectedOrder.courierName}</p>
                            <p className="text-xs font-mono text-gray-600 mt-1">AWB: {selectedOrder.awbCode}</p>
                          </div>
                          {selectedOrder.trackingUrl && (
                            <button onClick={() => window.open(selectedOrder.trackingUrl, '_blank')} className="px-4 py-2 bg-[#0E462B] text-white text-sm font-bold rounded-lg hover:bg-[#0E462B]/90 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
                              <ExternalLink size={14} /> Track Shipment
                            </button>
                          )}
                        </div>
                      )}

                      <div className="relative pl-4 space-y-6 overflow-hidden pb-2">
                        {/* Vertical line */}
                        <div className="absolute left-[35px] top-4 bottom-6 w-0.5 bg-gray-200 z-0"></div>
                        
                        {getTrackingSteps(selectedOrder).map((step, index) => {
                          const Icon = step.icon;
                          const steps = getTrackingSteps(selectedOrder);
                          const isActive = step.isCompleted && (!steps[index + 1]?.isCompleted);
                          return (
                            <div key={step.id} className={`relative z-10 flex items-start gap-4 transition-all duration-300 ${step.isCompleted ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${step.isCompleted ? (isActive ? 'bg-[#0E462B] text-white shadow-md scale-110' : 'bg-green-100 text-green-700') : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                                <Icon size={isActive ? 20 : 18} />
                              </div>
                              <div className="pt-2">
                                <p className={`font-bold ${isActive ? 'text-[#0E462B] text-base' : (step.isCompleted ? 'text-gray-900 text-sm' : 'text-gray-500 text-sm')}`}>
                                  {step.label}
                                </p>
                                {isActive && step.id === 'transit' && (
                                  <p className="text-xs text-[#0E462B] mt-1 font-medium">Your package is on the way.</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Notice */}
                  <div className="flex items-start sm:items-center gap-3 p-4 bg-[#25D366]/10 rounded-2xl border border-[#25D366]/20">
                    <div className="w-10 h-10 bg-[#25D366]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-[#128C7E]" />
                    </div>
                    <p className="text-[13px] sm:text-sm font-medium text-[#128C7E] leading-snug mt-1 sm:mt-0">
                      Your tracking ID and all updates will be shared via <span className="font-bold">WhatsApp</span>.
                    </p>
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
                      <p className="text-2xl font-bold text-white">₹{getDisplayPrice(selectedOrder)}</p>
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

      {/* Cancellation Feedback Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              <div className="p-6 pt-8 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order?</h3>
                <p className="text-sm text-gray-500 mb-6">Please tell us why you're cancelling. Your feedback helps us improve.</p>
                
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Reason for cancellation..."
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#0E462B]/20 outline-none h-32 resize-none mb-6"
                  autoFocus
                />

                <div className="flex gap-3">
                  <button
                    disabled={isCancelling}
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Keep Order
                  </button>
                  <button
                    disabled={isCancelling || !cancellationReason.trim()}
                    onClick={submitCancellation}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCancelling ? "Cancelling..." : "Confirm"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
