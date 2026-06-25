import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, getDocs, deleteDoc, doc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Book, LogOut, ChevronDown, CheckCircle, Trash2, AlertCircle, Plus, X, Package, ExternalLink, Search, MoreVertical, MapPin, Calendar, Hash, User, Clock, CreditCard } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

interface Order {
  id: string;
  userId: string;
  type: "mystery" | "vibe";
  mode: "guided" | "free";
  answers: any;
  delivery: any;
  price: number;
  createdAt: any;
  riasecScores?: Record<string, number>;
  topTypes?: string[];
  response?: string;
  bookQuantity?: string;
  status: 'confirmed' | 'cancelled' | 'delivered' | 'pending';
  budget?: number;
  cancellationReason?: string;
  shipmentCreated?: boolean;
  awbCode?: string;
  courierName?: string;
  trackingUrl?: string;
  shipmentStatus?: string;
}

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | "mystery" | "vibe" | "active" | "cancelled" | "pending" | "delivered">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null); // For 3-dot overflow menu
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [trackingModalOpen, setTrackingModalOpen] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState({ awbCode: '', courierName: '', trackingUrl: '' });
  
  // Form state for manual order
  const [manualOrder, setManualOrder] = useState({
    firstName: '',
    lastName: '',
    whatsapp: '',
    address: '',
    city: '',
    pincode: '',
    type: 'mystery' as 'mystery' | 'vibe',
    mode: 'guided' as 'guided' | 'free',
    budget: '349',
    bookQuantity: '1'
  });

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (!isAdmin) {
        navigate('/dashboard');
      }
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchOrders();
    }
  }, [user, isAdmin]);

  const fetchOrders = async () => {
    setIsFetching(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Permission denied or database disconnected. Please check Firestore Rules.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const handleDeleteOrder = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "orders", id));
      setOrders(orders.filter(o => o.id !== id));
      setOrderToDelete(null);
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "orders"), {
        userId: "MANUAL_" + Date.now(),
        type: manualOrder.type,
        mode: manualOrder.mode,
        budget: parseInt(manualOrder.budget),
        price: parseInt(manualOrder.budget) * parseInt(manualOrder.bookQuantity || "1"),
        bookQuantity: manualOrder.bookQuantity,
        delivery: {
          firstName: manualOrder.firstName,
          lastName: manualOrder.lastName,
          whatsapp: manualOrder.whatsapp,
          address: manualOrder.address,
          city: manualOrder.city,
          pincode: manualOrder.pincode
        },
        answers: {
          language: "English", // Default for manual
          bookQuantity: manualOrder.bookQuantity,
          notes: "Manually entered by admin"
        },
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      setShowManualModal(false);
      setManualOrder({
        firstName: '', lastName: '', whatsapp: '', address: '', 
        city: '', pincode: '', type: 'mystery', mode: 'guided', budget: '349', bookQuantity: '1'
      });
      fetchOrders();
    } catch (err) {
      console.error("Error adding manual order:", err);
      alert("Failed to add order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (e: React.MouseEvent, id: string, newStatus: string) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(db, "orders", id), { status: newStatus });
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus as any } : o));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  const handleAddTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalOpen) return;
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, "orders", trackingModalOpen), {
        shipmentCreated: true,
        shipmentStatus: "Packed",
        awbCode: trackingData.awbCode,
        courierName: trackingData.courierName,
        trackingUrl: trackingData.trackingUrl,
        shippedAt: serverTimestamp()
      });
      setOrders(orders.map(o => o.id === trackingModalOpen ? { 
        ...o, 
        shipmentCreated: true,
        shipmentStatus: "Packed",
        awbCode: trackingData.awbCode,
        courierName: trackingData.courierName,
        trackingUrl: trackingData.trackingUrl 
      } : o));
      setTrackingModalOpen(null);
      setTrackingData({ awbCode: '', courierName: '', trackingUrl: '' });
    } catch (err) {
      console.error("Error adding tracking:", err);
      alert("Failed to add tracking");
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E462B]"></div>
      </div>
    );
  }

  const VALID_BUDGETS = [349, 449, 689, 1299];

  const snapToValidBudget = (value: number) => {
    return VALID_BUDGETS.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  };

  const getBudgetPerBook = (order: Order) => {
    // Priority 1: explicitly saved top-level budget (new orders)
    if (order.budget && order.budget > 0) return order.budget;
    // Priority 2: budget saved inside answers (new orders)
    if (order.answers?.budget && order.answers.budget > 0) return order.answers.budget;
    // Priority 3: legacy orders — snap price/qty to nearest valid budget option
    // (prevents garbage values like ₹116 which was never a real option)
    if (order.price && order.price > 0) {
      const rawQty = order.bookQuantity || order.answers?.bookQuantity || "1";
      const qty = parseInt(String(rawQty).replace(/\D/g, '')) || 1;
      const derived = Math.round(order.price / qty);
      return snapToValidBudget(derived);
    }
    return 349; // absolute last resort
  };

  const getDisplayPrice = (order: Order) => {
    const rawQty = order.bookQuantity || order.answers?.bookQuantity || "1";
    const qty = parseInt(String(rawQty).replace(/\D/g, '')) || 1;
    return getBudgetPerBook(order) * qty;
  };

  const filteredOrders = orders.filter(o => {
    // 1. Filter by Status/Type
    let matchesFilter = true;
    if (filter === "active") matchesFilter = o.status !== 'cancelled';
    else if (filter === "cancelled") matchesFilter = o.status === 'cancelled';
    else if (filter === "mystery") matchesFilter = o.type === 'mystery';
    else if (filter === "vibe") matchesFilter = o.type === 'vibe';
    else if (filter === "pending") matchesFilter = o.status === 'pending';
    else if (filter === "delivered") matchesFilter = o.status === 'delivered';
    
    if (!matchesFilter) return false;

    // 2. Filter by Search Query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const searchStr = `
        ${o.id.toLowerCase()} 
        ${(o.delivery?.firstName || '').toLowerCase()} 
        ${(o.delivery?.lastName || '').toLowerCase()} 
        ${(o.delivery?.whatsapp || '').toLowerCase()} 
        ${(o.delivery?.city || '').toLowerCase()}
      `;
      if (!searchStr.includes(query)) return false;
    }
    
    return true;
  });

  // KPI Data
  const stats = {
    total: orders.length,
    active: orders.filter(o => o.status !== 'cancelled').length,
    mystery: orders.filter(o => o.type === 'mystery').length,
    vibe: orders.filter(o => o.type === 'vibe').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    pending: orders.filter(o => o.status === 'pending').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Tellex Admin
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowManualModal(true)}
                className="flex items-center text-sm font-bold bg-[#0E462B] text-[#e1cfbc] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-[#0E462B]/90 transition-colors shadow-sm"
              >
                <Plus size={16} className="mr-1 sm:mr-2" />
                <span className="hidden sm:inline">New Order</span>
                <span className="sm:hidden">New</span>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center text-sm font-bold bg-gray-100 text-gray-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <LogOut size={16} className="sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* KPI Statistics */}
        <div className="mb-6 overflow-x-auto pb-4 -mx-4 px-4 sm:px-0 sm:overflow-visible hide-scrollbar">
          <div className="flex gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:flex-wrap">
            {/* Total Orders */}
            <div 
              onClick={() => setFilter("all")}
              className={`bg-white p-4 rounded-2xl shadow-sm border min-w-[130px] flex-1 cursor-pointer transition-all hover:shadow-md ${
                filter === "all" ? "ring-2 ring-[#0E462B] border-[#0E462B]" : "border-gray-200"
              }`}
            >
              <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Total Orders</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            {/* Active Orders */}
            <div 
              onClick={() => setFilter("active")}
              className={`bg-white p-4 rounded-2xl shadow-sm border min-w-[130px] flex-1 cursor-pointer transition-all hover:shadow-md ${
                filter === "active" ? "ring-2 ring-[#0E462B] border-[#0E462B]" : "border-gray-200"
              }`}
            >
              <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Active</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#0E462B]">{stats.active}</p>
            </div>
            {/* Mystery Pick */}
            <div 
              onClick={() => setFilter("mystery")}
              className={`bg-white p-4 rounded-2xl shadow-sm border min-w-[130px] flex-1 cursor-pointer transition-all hover:shadow-md ${
                filter === "mystery" ? "ring-2 ring-purple-500 border-purple-500" : "border-gray-200"
              }`}
            >
              <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Mystery Pick</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-700">{stats.mystery}</p>
            </div>
            {/* Vibe Pick */}
            <div 
              onClick={() => setFilter("vibe")}
              className={`bg-white p-4 rounded-2xl shadow-sm border min-w-[130px] flex-1 cursor-pointer transition-all hover:shadow-md ${
                filter === "vibe" ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-200"
              }`}
            >
              <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Vibe Pick</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-700">{stats.vibe}</p>
            </div>
            {/* Pending Orders (NEW) */}
            <div 
              onClick={() => setFilter("pending")}
              className={`bg-white p-4 rounded-2xl shadow-sm border min-w-[130px] flex-1 cursor-pointer transition-all hover:shadow-md ${
                filter === "pending" ? "ring-2 ring-orange-500 border-orange-500 bg-orange-50/30" : "border-gray-200"
              }`}
            >
              <p className="text-orange-600 text-xs sm:text-sm font-medium mb-1">Pending</p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            {/* Delivered Orders (NEW) */}
            <div 
              onClick={() => setFilter("delivered")}
              className={`bg-white p-4 rounded-2xl shadow-sm border min-w-[130px] flex-1 cursor-pointer transition-all hover:shadow-md ${
                filter === "delivered" ? "ring-2 ring-green-500 border-green-500 bg-green-50/30" : "border-gray-200"
              }`}
            >
              <p className="text-green-600 text-xs sm:text-sm font-medium mb-1">Delivered</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.delivered}</p>
            </div>
            {/* Cancelled */}
            <div 
              onClick={() => setFilter("cancelled")}
              className={`p-4 rounded-2xl shadow-sm border min-w-[130px] flex-1 cursor-pointer transition-all hover:shadow-md ${
                filter === "cancelled" ? "ring-2 ring-red-500 border-red-500 bg-red-50" : "border-red-100 bg-red-50/30"
              }`}
            >
              <p className="text-red-500 text-xs sm:text-sm font-bold mb-1">Cancelled</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
          </div>
        </div>

        {/* Sticky Search & Filter Section */}
        <div className="sticky top-[69px] sm:top-[73px] z-40 bg-[#FAF9F6] pt-2 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex flex-col gap-3">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by Name, Phone, City, or Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0E462B]/20 focus:border-[#0E462B] shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {[
                { id: "all", label: "All", count: stats.total },
                { id: "active", label: "Active", count: stats.active },
                { id: "pending", label: "Pending", count: stats.pending },
                { id: "delivered", label: "Delivered", count: stats.delivered },
                { id: "mystery", label: "Mystery", count: stats.mystery },
                { id: "vibe", label: "Vibe", count: stats.vibe },
                { id: "cancelled", label: "Cancelled", count: stats.cancelled },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors border ${
                    filter === f.id
                      ? "bg-[#0E462B] text-white border-[#0E462B]"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {f.label} <span className={`opacity-60 text-[11px]`}>({f.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E0] overflow-hidden">
          {error ? (
            <div className="p-12 text-center text-red-500 flex flex-col items-center">
              <AlertCircle size={48} className="mb-4 opacity-50" />
              <p className="font-bold">{error}</p>
              <button onClick={() => {setError(null); fetchOrders();}} className="mt-4 text-sm font-bold underline">Retry</button>
            </div>
          ) : isFetching ? (
            <div className="p-12 text-center text-gray-500">Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No orders found for this filter.</div>
          ) : (
            <div className="divide-y divide-[#E5E5E0]">
              {filteredOrders.map(order => (
                <div key={order.id} className="relative border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <div 
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    {/* Header Row: Initials + Details + Status + Menu */}
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                          {order.delivery?.firstName?.charAt(0) || '?'}{order.delivery?.lastName?.charAt(0) || ''}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-[16px] font-semibold text-gray-900 leading-none">
                              {order.delivery?.firstName} {order.delivery?.lastName}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {order.status.toUpperCase()}
                            </span>
                            {order.type === 'mystery' && <Sparkles size={12} className="text-purple-500" />}
                          </div>
                          
                          <div className="flex flex-wrap items-center text-[13px] text-gray-500 gap-x-3 gap-y-1">
                            <span className="flex items-center gap-1"><MapPin size={12}/> {order.delivery?.city || 'Unknown'}</span>
                            <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(order.createdAt?.toMillis() || Date.now()).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Package size={12}/> {order.mode === 'guided' ? 'Guided' : 'Free'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 text-right">
                        <div className="hidden sm:block">
                          <p className="text-[16px] font-bold text-gray-900 leading-none mb-1">₹{getDisplayPrice(order)}</p>
                          <p className="text-[11px] font-medium text-gray-400">₹{getBudgetPerBook(order)}/book</p>
                        </div>
                        
                        {/* 3 Dot Menu Container */}
                        <div className="relative">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === order.id ? null : order.id); }}
                            className="p-2 -mr-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical size={20} />
                          </button>
                          
                          {/* Dropdown Menu */}
                          {activeMenu === order.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveMenu(null); }} />
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setExpandedOrder(expandedOrder === order.id ? null : order.id); setActiveMenu(null); }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <ExternalLink size={16} className="text-gray-400"/> View Details
                                </button>
                                {order.status !== 'cancelled' && (
                                  <>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleUpdateStatus(e, order.id, 'delivered'); setActiveMenu(null); }}
                                      className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center gap-2"
                                    >
                                      <CheckCircle size={16} className="text-green-500"/> Mark Delivered
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleUpdateStatus(e, order.id, 'pending'); setActiveMenu(null); }}
                                      className="w-full text-left px-4 py-2 text-sm text-orange-700 hover:bg-orange-50 flex items-center gap-2"
                                    >
                                      <Clock size={16} className="text-orange-500"/> Mark Pending
                                    </button>
                                  </>
                                )}
                                <div className="h-px bg-gray-100 my-1 mx-2" />
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setOrderToDelete(order.id); setActiveMenu(null); }}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 size={16} className="text-red-500"/> Delete Order
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile Amount Row */}
                    <div className="sm:hidden flex items-center justify-between w-full mt-2 pt-2 border-t border-gray-50">
                      <span className="text-[12px] font-medium text-gray-500">Total Amount</span>
                      <div className="text-right">
                        <span className="text-[15px] font-bold text-gray-900 leading-none">₹{getDisplayPrice(order)}</span>
                        <span className="text-[11px] font-medium text-gray-400 ml-2">₹{getBudgetPerBook(order)}/ea</span>
                      </div>
                    </div>

                    {/* Delete Confirmation Inline */}
                    {orderToDelete === order.id && (
                      <div className="w-full mt-3 flex items-center justify-between gap-3 bg-red-50 p-3 rounded-xl border border-red-100">
                        <span className="text-[13px] font-bold text-red-700 flex items-center gap-1.5">
                          <AlertCircle size={16} /> Delete this order?
                        </span>
                        <div className="flex gap-2">
                          <button 
                            disabled={isDeleting}
                            onClick={(e) => { e.stopPropagation(); setOrderToDelete(null); }}
                            className="bg-white border border-gray-200 text-gray-700 text-xs px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            disabled={isDeleting}
                            onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id); }}
                            className="bg-red-600 text-white text-xs px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
                          >
                            {isDeleting ? '...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="mt-6 pl-16 space-y-6">
                      
                      {/* ADMIN INSIGHT (RIASEC Generated Response) */}
                      {order.response && (
                        <div className="bg-[#0E462B]/5 border-l-4 border-[#0E462B] p-4 rounded-r-xl">
                          <h4 className="text-xs font-bold text-[#0E462B] tracking-widest uppercase mb-2 flex items-center gap-2">
                            <Sparkles size={14} /> Admin Insight (Generated Response)
                          </h4>
                          <p className="text-gray-800 text-sm whitespace-pre-wrap italic">
                            {order.response}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Customer Answers */}
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">User Answers & Preferences</h4>
                          {order.mode === 'guided' ? (
                            <dl className="space-y-3 text-sm">
                              {order.topTypes && order.topTypes.length > 0 && (
                                <div className="grid grid-cols-3 bg-purple-50 p-2 rounded"><dt className="text-gray-500 font-bold">Top Traits</dt><dd className="col-span-2 font-bold text-purple-700">{order.topTypes.join(" + ")}</dd></div>
                              )}
                              {order.riasecScores && (
                                <div className="grid grid-cols-3"><dt className="text-gray-500">RIASEC</dt><dd className="col-span-2 text-xs font-mono text-gray-500">I:{order.riasecScores.I} A:{order.riasecScores.A} E:{order.riasecScores.E} S:{order.riasecScores.S}</dd></div>
                              )}
                              <div className="grid grid-cols-3"><dt className="text-gray-500">Emotion</dt><dd className="col-span-2 font-medium">{order.answers?.emotion}</dd></div>
                              <div className="grid grid-cols-3"><dt className="text-gray-500">Life Situation</dt><dd className="col-span-2 font-medium">{order.answers?.lifeSituation}</dd></div>
                              <div className="grid grid-cols-3"><dt className="text-gray-500">Decision Style</dt><dd className="col-span-2 font-medium">{order.answers?.decisionStyle || 'N/A'}</dd></div>
                              <div className="grid grid-cols-3"><dt className="text-gray-500">Current Need</dt><dd className="col-span-2 font-medium bg-blue-50 px-2 py-0.5 rounded inline-block text-blue-700">{order.answers?.currentNeed || 'N/A'}</dd></div>
                              <div className="grid grid-cols-3"><dt className="text-gray-500">Reasons</dt><dd className="col-span-2 font-medium">{(order.answers?.reasons || []).join(', ')}</dd></div>
                              <div className="grid grid-cols-3"><dt className="text-gray-500">Wants</dt><dd className="col-span-2 font-medium">{(order.answers?.wants || []).join(', ')}</dd></div>
                              <div className="grid grid-cols-3"><dt className="text-gray-500">Book Type</dt><dd className="col-span-2 font-medium">{order.answers?.bookType}</dd></div>
                              <div className="grid grid-cols-3 font-bold"><dt className="text-gray-500">Quantity</dt><dd className="col-span-2 text-[#0E462B]">{order.answers?.bookQuantity || '1'} {parseInt(String(order.answers?.bookQuantity || '1').replace(/\D/g, '')) === 1 ? 'Book' : 'Books'}</dd></div>
                              <div className="grid grid-cols-3 font-bold"><dt className="text-gray-500">Price/Book</dt><dd className="col-span-2 text-[#0E462B]">₹{getBudgetPerBook(order)}</dd></div>
                              <div className="grid grid-cols-3"><dt className="text-gray-500">Language</dt><dd className="col-span-2 font-medium">{order.answers?.language}</dd></div>
                              <div className="grid grid-cols-3"><dt className="text-gray-500">Order Status</dt><dd className={`col-span-2 font-bold ${order.status === 'cancelled' ? 'text-red-500' : 'text-green-600'}`}>{order.status === 'cancelled' ? 'Cancelled by Customer' : 'Active / Processing'}</dd></div>
                              {order.status === 'cancelled' && order.cancellationReason && (
                                <div className="grid grid-cols-3 bg-red-50 p-2 rounded border border-red-100 mt-1">
                                  <dt className="text-red-500 font-bold">Cancellation Reason</dt>
                                  <dd className="col-span-2 font-medium text-red-700 italic">"{order.cancellationReason}"</dd>
                                </div>
                              )}
                              <div className="mt-2 text-gray-500">Books already read:</div>
                              <div className="p-3 bg-gray-100 rounded text-gray-800 italic">{order.answers?.readBooks}</div>
                            </dl>
                          ) : (
                            <dl className="space-y-3 text-sm">
                              <div className="text-gray-500 mb-1">Their Vibe / Problem:</div>
                              <div className="p-4 bg-gray-100 rounded text-gray-800 italic mb-4">"{order.answers?.vibe}"</div>
                              <div className="grid grid-cols-3"><dt className="text-gray-500">Language</dt><dd className="col-span-2 font-medium">{order.answers?.language}</dd></div>
                              <div className="grid grid-cols-3"><dt className="text-gray-500">Book Type</dt><dd className="col-span-2 font-medium">{order.answers?.bookType}</dd></div>
                              <div className="grid grid-cols-3 font-bold"><dt className="text-gray-500">Quantity</dt><dd className="col-span-2 text-[#0E462B]">{order.answers?.bookQuantity || '1'} {parseInt(String(order.answers?.bookQuantity || '1').replace(/\D/g, '')) === 1 ? 'Book' : 'Books'}</dd></div>
                              <div className="grid grid-cols-3 font-bold"><dt className="text-gray-500">Price/Book</dt><dd className="col-span-2 text-[#0E462B]">₹{getBudgetPerBook(order)}</dd></div>
                              <div className="grid grid-cols-3"><dt className="text-gray-500">Avoid</dt><dd className="col-span-2 font-medium text-red-600">{order.answers?.avoidTrigger}</dd></div>
                              <div className="grid grid-cols-3"><dt className="text-gray-500">Order Status</dt><dd className={`col-span-2 font-bold ${order.status === 'cancelled' ? 'text-red-500' : 'text-green-600'}`}>{order.status === 'cancelled' ? 'Cancelled by Customer' : 'Active / Processing'}</dd></div>
                              {order.status === 'cancelled' && order.cancellationReason && (
                                <div className="grid grid-cols-3 bg-red-50 p-2 rounded border border-red-100 mt-1">
                                  <dt className="text-red-500 font-bold">Cancellation Reason</dt>
                                  <dd className="col-span-2 font-medium text-red-700 italic">"{order.cancellationReason}"</dd>
                                </div>
                              )}
                              <div className="mt-2 text-gray-500">Books already read:</div>
                              <div className="p-3 bg-gray-100 rounded text-gray-800 italic">{order.answers?.readBooks}</div>
                            </dl>
                          )}
                        </div>

                      {/* Delivery Info */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Fulfillment Details</h4>
                        <dl className="space-y-3 text-sm bg-[#FAF9F6] p-4 rounded-lg border border-[#E5E5E0]">
                          <div className="grid grid-cols-3">
                            <dt className="text-gray-500">Total Price</dt>
                            <dd className="col-span-2">
                              <span className="font-bold text-[#0E462B] text-lg">₹{getDisplayPrice(order)}</span>
                              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                                Breakdown: ₹{getBudgetPerBook(order)} x {(() => {
                                  const rawQty = order.bookQuantity || order.answers?.bookQuantity || "1";
                                  return parseInt(String(rawQty).replace(/\D/g, '')) || 1;
                                })()} Books
                              </p>
                            </dd>
                          </div>
                          <div className="grid grid-cols-3"><dt className="text-gray-500">Phone (WA)</dt><dd className="col-span-2 font-medium text-green-700">{order.delivery?.whatsapp}</dd></div>
                          <div className="grid grid-cols-3"><dt className="text-gray-500">Address</dt><dd className="col-span-2 font-medium">{order.delivery?.address}</dd></div>
                          <div className="grid grid-cols-3"><dt className="text-gray-500">City / Pin</dt><dd className="col-span-2 font-medium">{order.delivery?.city} - {order.delivery?.pincode}</dd></div>
                          <div className="grid grid-cols-3"><dt className="text-gray-500">Payment</dt><dd className="col-span-2 font-medium">Cash on Delivery (COD)</dd></div>
                          <div className="grid grid-cols-3"><dt className="text-gray-500">Order ID</dt><dd className="col-span-2 font-mono text-xs text-gray-400">{order.id}</dd></div>
                        </dl>
                        
                        <div className="mt-6 flex flex-col gap-3">
                          {!order.shipmentCreated ? (
                            <button 
                              onClick={() => setTrackingModalOpen(order.id)}
                              className="w-full flex items-center justify-center gap-2 bg-[#0E462B] text-[#e1cfbc] py-3 px-4 rounded-lg font-medium hover:bg-[#0E462B]/90 transition-colors"
                            >
                              <Package size={18} /> Add Tracking & Mark Packed
                            </button>
                          ) : (
                            <>
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Shipment Details</p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div><span className="text-gray-500">Status:</span> <span className="font-bold text-[#0E462B]">{order.shipmentStatus}</span></div>
                                  <div><span className="text-gray-500">Courier:</span> <span className="font-medium">{order.courierName}</span></div>
                                  <div className="col-span-2"><span className="text-gray-500">AWB:</span> <span className="font-mono text-gray-900">{order.awbCode}</span></div>
                                </div>
                              </div>
                              <button 
                                onClick={() => window.open(order.trackingUrl, '_blank')}
                                className="w-full flex items-center justify-center gap-2 bg-gray-100 text-[#0E462B] py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                              >
                                <ExternalLink size={18} /> View Tracking
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      </div>

                      {/* RAW DATA SECTION */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-4 w-1 bg-gray-300 rounded-full"></div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Firestore Record (Raw)</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {Object.entries(order).map(([key, value]) => {
                            if (key === 'createdAt' || key === 'id') return null;
                            return (
                              <div key={key} className="p-3 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                                <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{key}</span>
                                {typeof value === 'object' && value !== null ? (
                                  <div className="space-y-1">
                                    {Object.entries(value).map(([subK, subV]) => (
                                      <div key={subK} className="flex justify-between gap-4 text-xs">
                                        <span className="text-gray-500 shrink-0">{subK}:</span>
                                        <span className="text-gray-900 font-mono break-all text-right">{JSON.stringify(subV)}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-900 font-mono break-all">{String(value)}</span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Manual Order Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>Add Manual Order</h2>
              <button 
                onClick={() => setShowManualModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleManualSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Customer Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">First Name</label>
                    <input required value={manualOrder.firstName} onChange={e => setManualOrder({...manualOrder, firstName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0E462B]/20 outline-none" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Last Name</label>
                    <input required value={manualOrder.lastName} onChange={e => setManualOrder({...manualOrder, lastName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0E462B]/20 outline-none" placeholder="Doe" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">WhatsApp Number</label>
                    <input required value={manualOrder.whatsapp} onChange={e => setManualOrder({...manualOrder, whatsapp: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0E462B]/20 outline-none" placeholder="+91 00000 00000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">City</label>
                    <input required value={manualOrder.city} onChange={e => setManualOrder({...manualOrder, city: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0E462B]/20 outline-none" placeholder="Mumbai" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Address</label>
                  <textarea required value={manualOrder.address} onChange={e => setManualOrder({...manualOrder, address: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0E462B]/20 outline-none h-20" placeholder="Full address..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Pincode</label>
                  <input required value={manualOrder.pincode} onChange={e => setManualOrder({...manualOrder, pincode: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0E462B]/20 outline-none" placeholder="000000" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Order Preferences</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Pick Type</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setManualOrder({...manualOrder, type: 'mystery'})} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${manualOrder.type === 'mystery' ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-gray-50 border-gray-200'}`}>Mystery</button>
                      <button type="button" onClick={() => setManualOrder({...manualOrder, type: 'vibe'})} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${manualOrder.type === 'vibe' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200'}`}>Vibe</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Mode</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setManualOrder({...manualOrder, mode: 'guided'})} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${manualOrder.mode === 'guided' ? 'bg-[#0E462B] border-[#0E462B] text-white' : 'bg-gray-50 border-gray-200'}`}>Guided</button>
                      <button type="button" onClick={() => setManualOrder({...manualOrder, mode: 'free'})} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${manualOrder.mode === 'free' ? 'bg-[#0E462B] border-[#0E462B] text-white' : 'bg-gray-50 border-gray-200'}`}>Free</button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Budget (₹)</label>
                    <select value={manualOrder.budget} onChange={e => setManualOrder({...manualOrder, budget: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0E462B]/20 outline-none bg-white">
                      {["349", "449", "689", "1299"].map(b => <option key={b} value={b}>₹{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Quantity</label>
                    <div className="flex gap-2">
                      {["1", "2", "3"].map(q => (
                        <button key={q} type="button" onClick={() => setManualOrder({...manualOrder, bookQuantity: q})} className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${manualOrder.bookQuantity === q ? 'bg-[#0E462B] border-[#0E462B] text-white' : 'bg-gray-50 border-gray-200'}`}>{q}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  disabled={isSubmitting}
                  className="w-full bg-[#0E462B] text-[#e1cfbc] py-4 rounded-xl font-bold text-lg hover:bg-[#0E462B]/90 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding Order...' : 'Create Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Tracking Modal */}
      {trackingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>Add Tracking</h2>
              <button onClick={() => setTrackingModalOpen(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTracking} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">AWB Number</label>
                <input required value={trackingData.awbCode} onChange={e => setTrackingData({...trackingData, awbCode: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0E462B]/20 outline-none font-mono" placeholder="1234567890" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Courier Partner</label>
                <input required value={trackingData.courierName} onChange={e => setTrackingData({...trackingData, courierName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0E462B]/20 outline-none" placeholder="Delhivery, Bluedart, etc." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Tracking URL</label>
                <input required type="url" value={trackingData.trackingUrl} onChange={e => setTrackingData({...trackingData, trackingUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0E462B]/20 outline-none" placeholder="https://shiprocket.co/tracking/..." />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setTrackingModalOpen(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-[#0E462B] text-[#e1cfbc] rounded-xl font-bold hover:bg-[#0E462B]/90 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Tracking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
