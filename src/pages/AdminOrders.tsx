import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, getDocs, deleteDoc, doc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Book, LogOut, ChevronDown, CheckCircle, Trash2, AlertCircle, Plus, X } from 'lucide-react';
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
}

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | "mystery" | "vibe" | "active" | "cancelled">("all");
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    if (filter === "all") return true;
    if (filter === "active") return o.status !== 'cancelled';
    if (filter === "cancelled") return o.status === 'cancelled';
    if (filter === "mystery") return o.type === 'mystery';
    if (filter === "vibe") return o.type === 'vibe';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Top Nav */}
      <header className="bg-[#0E462B] text-[#e1cfbc] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Tellex Admin
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowManualModal(true)}
                className="flex items-center text-sm font-medium hover:text-[#0E462B] transition-colors bg-[#e1cfbc] text-[#0E462B] px-4 py-2 rounded-lg font-bold"
              >
                <Plus size={16} className="mr-2" />
                New Order
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center text-sm font-medium hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-lg"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats & Filters — click any card to filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            {/* Total Orders */}
            <div 
              onClick={() => setFilter(filter === "all" ? "all" : "all")}
              className={`bg-white p-4 rounded-xl shadow-sm border min-w-[120px] cursor-pointer transition-all hover:shadow-md ${
                filter === "all" ? "ring-2 ring-[#0E462B] border-[#0E462B]" : "border-[#E5E5E0]"
              }`}
            >
              <p className="text-gray-500 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
            </div>
            {/* Active Orders */}
            <div 
              onClick={() => setFilter(filter === "active" ? "all" : "active")}
              className={`bg-white p-4 rounded-xl shadow-sm border min-w-[120px] cursor-pointer transition-all hover:shadow-md ${
                filter === "active" ? "ring-2 ring-[#0E462B] border-[#0E462B]" : "border-[#E5E5E0]"
              }`}
            >
              <p className="text-gray-500 text-sm font-medium">Active Orders</p>
              <p className="text-3xl font-bold text-[#0E462B]">{orders.filter(o => o.status !== 'cancelled').length}</p>
            </div>
            {/* Mystery Pick */}
            <div 
              onClick={() => setFilter(filter === "mystery" ? "all" : "mystery")}
              className={`bg-white p-4 rounded-xl shadow-sm border min-w-[120px] cursor-pointer transition-all hover:shadow-md ${
                filter === "mystery" ? "ring-2 ring-purple-500 border-purple-500" : "border-[#E5E5E0]"
              }`}
            >
              <p className="text-gray-500 text-sm font-medium">Mystery Pick</p>
              <p className="text-3xl font-bold text-purple-700">{orders.filter(o => o.type === 'mystery').length}</p>
            </div>
            {/* Vibe Pick */}
            <div 
              onClick={() => setFilter(filter === "vibe" ? "all" : "vibe")}
              className={`bg-white p-4 rounded-xl shadow-sm border min-w-[120px] cursor-pointer transition-all hover:shadow-md ${
                filter === "vibe" ? "ring-2 ring-blue-500 border-blue-500" : "border-[#E5E5E0]"
              }`}
            >
              <p className="text-gray-500 text-sm font-medium">Vibe Pick</p>
              <p className="text-3xl font-bold text-blue-700">{orders.filter(o => o.type === 'vibe').length}</p>
            </div>
            {/* Cancelled */}
            <div 
              onClick={() => setFilter(filter === "cancelled" ? "all" : "cancelled")}
              className={`p-4 rounded-xl shadow-sm border min-w-[120px] cursor-pointer transition-all hover:shadow-md ${
                filter === "cancelled" ? "ring-2 ring-red-500 border-red-500 bg-red-50" : "border-red-100 bg-red-50/30"
              }`}
            >
              <p className="text-red-500 text-sm font-bold">Cancelled</p>
              <p className="text-3xl font-bold text-red-600">{orders.filter(o => o.status === 'cancelled').length}</p>
            </div>
          </div>
          {filter !== "all" && (
            <p className="mt-3 text-sm text-gray-500">Showing <span className="font-bold text-gray-800">{filteredOrders.length}</span> {filter} orders. <button onClick={() => setFilter("all")} className="text-[#0E462B] font-bold underline ml-1">Clear filter</button></p>
          )}
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
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div 
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-center gap-4">
                      {order.type === 'mystery' ? (
                        <div className="bg-purple-100 text-purple-700 p-3 rounded-full"><Sparkles size={20} /></div>
                      ) : (
                        <div className="bg-blue-100 text-blue-700 p-3 rounded-full"><Book size={20} /></div>
                      )}
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {order.delivery?.firstName} {order.delivery?.lastName}
                          </h3>
                          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded ml-2">
                            Mode: {order.mode}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {order.delivery?.city} • <span className="font-bold text-[#0E462B]">₹{getDisplayPrice(order)}</span> (₹{getBudgetPerBook(order)} each) • {new Date(order.createdAt?.toMillis() || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Status Toggle Buttons */}
                      <div className="hidden sm:flex items-center gap-2 mr-4">
                        {order.status === 'cancelled' ? (
                          <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg font-bold text-xs border border-red-200">
                            CANCELLED BY CUSTOMER
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={(e) => handleUpdateStatus(e, order.id, 'delivered')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${order.status === 'delivered' ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600 border border-transparent hover:border-green-200'}`}
                            >
                              Delivered
                            </button>
                            <button 
                              onClick={(e) => handleUpdateStatus(e, order.id, 'confirmed')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${order.status === 'confirmed' || order.status === 'pending' ? 'bg-[#0E462B] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-600 border border-transparent hover:border-orange-200'}`}
                            >
                              Pending
                            </button>
                          </>
                        )}
                      </div>

                      {orderToDelete === order.id ? (
                        <div className="flex items-center gap-3 bg-red-50 p-2 rounded-lg border border-red-100">
                          <span className="text-xs font-bold text-red-600 uppercase flex items-center gap-1">
                            <AlertCircle size={14} /> Are you sure?
                          </span>
                          <button 
                            disabled={isDeleting}
                            onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id); }}
                            className="bg-red-600 text-white text-xs px-3 py-1.5 rounded font-bold hover:bg-red-700 transition-colors"
                          >
                            {isDeleting ? '...' : 'YES'}
                          </button>
                          <button 
                            disabled={isDeleting}
                            onClick={(e) => { e.stopPropagation(); setOrderToDelete(null); }}
                            className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded font-bold hover:bg-gray-300 transition-colors"
                          >
                            NO
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setOrderToDelete(order.id); }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Order"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                      
                      <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                    </div>
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
                        
                        <div className="mt-6 text-center">
                          <button className="w-full flex items-center justify-center gap-2 bg-[#0E462B] text-[#e1cfbc] py-3 px-4 rounded-lg font-medium hover:bg-[#0E462B]/90 transition-colors">
                            <CheckCircle size={18} /> Mark as Processed
                          </button>
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
    </div>
  );
}
