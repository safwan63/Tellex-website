import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Book, Sparkles } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0E462B]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Top Nav for Dashboard */}
      <header className="bg-white border-b border-[#E5E5E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-[#0E462B]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Tellex
            </Link>
            <UserAvatar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0E462B] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome back.
          </h2>
          <p className="text-gray-600 text-lg">Your next chapter awaits. Choose how you'd like to discover it.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Mystery Pick Card */}
          <div className="bg-white rounded-2xl p-8 border border-[#0E462B]/10 shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="w-14 h-14 bg-[#0E462B] rounded-xl flex items-center justify-center mb-6">
              <Sparkles className="text-[#e1cfbc]" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-[#0E462B] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Mystery Pick
            </h3>
            <p className="text-gray-600 mb-8 flex-grow">
              Share your mood and vibe. We'll hand-select a secret book tailored to your emotional state and deliver it to your door.
            </p>
            <Link 
              to="/flow?type=mystery"
              className="inline-flex justify-center items-center w-full py-3.5 px-4 rounded-lg bg-[#0E462B] text-[#e1cfbc] font-medium hover:bg-[#0E462B]/90 transition-colors shadow-sm"
            >
              Start Mystery Pick
            </Link>
          </div>

          {/* Vibe Pick Card */}
          <div className="bg-white rounded-2xl p-8 border border-[#e1cfbc] shadow-lg hover:shadow-xl transition-shadow flex flex-col h-full">
            <div className="w-14 h-14 bg-[#FAF9F6] border border-[#e1cfbc] rounded-xl flex items-center justify-center mb-6">
              <Book className="text-[#0E462B]" size={28} />
            </div>
            <h3 className="text-2xl font-bold text-[#0E462B] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Vibe Pick
            </h3>
            <p className="text-gray-600 mb-8 flex-grow">
              Tell us exactly what you're looking for. We'll match you with the perfect book and reveal it to you within 24 hours.
            </p>
            <Link 
              to="/flow?type=vibe"
              className="inline-flex justify-center items-center w-full py-3.5 px-4 rounded-lg bg-white border-2 border-[#0E462B] text-[#0E462B] font-medium hover:bg-[#FAF9F6] transition-colors shadow-sm"
            >
              Start Vibe Pick
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
