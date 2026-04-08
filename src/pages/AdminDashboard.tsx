import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, Mail, ChevronRight, Settings, Shield } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E462B]"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    navigate('/login');
    return null;
  }

  const adminModules = [
    {
      title: "Order Management",
      description: "View and process mystery and vibe pick orders from Firebase.",
      icon: <Package size={24} className="text-[#0E462B]" />,
      path: "/admin/orders",
      stats: "Real-time Firebase"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-[#0E462B] p-3 rounded-xl">
            <Shield className="text-[#e1cfbc]" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Admin Control Center
            </h1>
            <p className="text-gray-600">Unified management for Tellex systems</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminModules.map((module, index) => (
            <div 
              key={index}
              onClick={() => navigate(module.path)}
              className="bg-white rounded-2xl p-8 border border-[#E5E5E0] shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E5E5E0] group-hover:border-[#0E462B]/30 transition-colors text-[#0E462B]">
                  {module.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded">
                  {module.stats}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-[#0E462B] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {module.title}
              </h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                {module.description}
              </p>
              
              <div className="flex items-center text-sm font-bold text-[#0E462B] group-hover:gap-2 transition-all">
                Enter Module <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-white rounded-2xl border border-[#E5E5E0] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Settings className="text-gray-400" size={20} />
            <span className="text-sm text-gray-500">System Status: All systems operational</span>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-sm font-bold text-[#0E462B] hover:underline"
          >
            Back to Member Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
