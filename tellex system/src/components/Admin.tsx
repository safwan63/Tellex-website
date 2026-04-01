"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Package, Sparkles, Book, LogOut, ChevronDown, CheckCircle, Trash2, AlertCircle } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface Order {
  id: string;
  userId: string;
  type: "mystery" | "vibe";
  mode: "guided" | "free";
  answers: any;
  delivery: any;
  budget: number;
  createdAt: any;
}

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | "mystery" | "vibe">("all");
  const [isFetching, setIsFetching] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setIsFetching(true);
    try {
      const q = query(collection(db, "tellex_orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleDeleteOrder = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "tellex_orders", id));
      setOrders(orders.filter(o => o.id !== id));
      setOrderToDelete(null);
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E462B]"></div>
      </div>
    );
  }

  const filteredOrders = orders.filter(o => filter === "all" || o.type === filter);

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
            <button 
              onClick={handleLogout}
              className="flex items-center text-sm font-medium hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-lg"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats & Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E5E5E0] min-w-[120px]">
              <p className="text-gray-500 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-[#0E462B]">{orders.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E5E5E0] min-w-[120px]">
              <p className="text-gray-500 text-sm font-medium">Mystery Pick</p>
              <p className="text-3xl font-bold text-purple-700">{orders.filter(o => o.type === 'mystery').length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-[#E5E5E0] min-w-[120px]">
              <p className="text-gray-500 text-sm font-medium">Vibe Pick</p>
              <p className="text-3xl font-bold text-blue-700">{orders.filter(o => o.type === 'vibe').length}</p>
            </div>
          </div>

          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-[#E5E5E0]">
            <button 
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === "all" ? "bg-[#0E462B] text-[#e1cfbc]" : "text-gray-600 hover:bg-gray-100"}`}
            >
              All Orders
            </button>
            <button 
              onClick={() => setFilter("mystery")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${filter === "mystery" ? "bg-purple-100 text-purple-800 border border-purple-200" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <Sparkles size={14} className="mr-1.5" /> Mystery Pick
            </button>
            <button 
              onClick={() => setFilter("vibe")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${filter === "vibe" ? "bg-blue-100 text-blue-800 border border-blue-200" : "text-gray-600 hover:bg-gray-100"}`}
            >
              <Book size={14} className="mr-1.5" /> Vibe Pick
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E0] overflow-hidden">
          {isFetching ? (
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
                          {order.delivery?.city} • ₹{order.budget} • {new Date(order.createdAt?.toMillis() || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {orderToDelete === order.id ? (
                        <div className="flex items-center gap-3 bg-red-50 p-2 rounded-lg border border-red-100 animate-in fade-in zoom-in duration-200">
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
                    <div className="mt-6 pl-16 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-200">
                      
                      {/* Customer Answers */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">User Answers & Preferences</h4>
                        {order.mode === 'guided' ? (
                          <dl className="space-y-3 text-sm">
                            <div className="grid grid-cols-3"><dt className="text-gray-500">Emotion</dt><dd className="col-span-2 font-medium">{order.answers?.emotion}</dd></div>
                            <div className="grid grid-cols-3"><dt className="text-gray-500">Life Situation</dt><dd className="col-span-2 font-medium">{order.answers?.lifeSituation}</dd></div>
                            <div className="grid grid-cols-3"><dt className="text-gray-500">Reasons</dt><dd className="col-span-2 font-medium">{(order.answers?.reasons || []).join(', ')}</dd></div>
                            <div className="grid grid-cols-3"><dt className="text-gray-500">Wants</dt><dd className="col-span-2 font-medium">{(order.answers?.wants || []).join(', ')}</dd></div>
                            <div className="grid grid-cols-3"><dt className="text-gray-500">Book Type</dt><dd className="col-span-2 font-medium">{order.answers?.bookType}</dd></div>
                            <div className="grid grid-cols-3"><dt className="text-gray-500">Language</dt><dd className="col-span-2 font-medium">{order.answers?.language}</dd></div>
                            <div className="mt-2 text-gray-500">Books already read:</div>
                            <div className="p-3 bg-gray-100 rounded text-gray-800 italic">{order.answers?.readBooks}</div>
                          </dl>
                        ) : (
                          <dl className="space-y-3 text-sm">
                            <div className="text-gray-500 mb-1">Their Vibe / Problem:</div>
                            <div className="p-4 bg-gray-100 rounded text-gray-800 italic mb-4">"{order.answers?.vibe}"</div>
                            <div className="grid grid-cols-3"><dt className="text-gray-500">Language</dt><dd className="col-span-2 font-medium">{order.answers?.language}</dd></div>
                            <div className="grid grid-cols-3"><dt className="text-gray-500">Book Type</dt><dd className="col-span-2 font-medium">{order.answers?.bookType}</dd></div>
                            <div className="grid grid-cols-3"><dt className="text-gray-500">Avoid</dt><dd className="col-span-2 font-medium text-red-600">{order.answers?.avoidTrigger}</dd></div>
                            <div className="mt-2 text-gray-500">Books already read:</div>
                            <div className="p-3 bg-gray-100 rounded text-gray-800 italic">{order.answers?.readBooks}</div>
                          </dl>
                        )}
                      </div>

                      {/* Delivery Info */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Fulfillment Details</h4>
                        <dl className="space-y-3 text-sm bg-[#FAF9F6] p-4 rounded-lg border border-[#E5E5E0]">
                          <div className="grid grid-cols-3"><dt className="text-gray-500">Budget Limit</dt><dd className="col-span-2 font-bold text-[#0E462B] text-lg">₹{order.budget}</dd></div>
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
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
