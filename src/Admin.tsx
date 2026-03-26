import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Mail, Calendar, User, MessageSquare, Download, RefreshCw, AlertCircle, Lock } from 'lucide-react';
import { isAdminAuthenticated, setAdminAuth, clearAdminAuth, getAdminPassword } from './lib/auth';
import { sanitizeInput, sanitizeForCSV } from './lib/security';

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function Admin() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        setError('Supabase is not configured. Please set up your environment variables.');
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setSubmissions(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch submissions');
      console.error('Error fetching submissions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication status
    const authenticated = isAdminAuthenticated();
    setIsAuthenticated(authenticated);
    setIsCheckingAuth(false);
    
    if (authenticated) {
      fetchSubmissions();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const correctPassword = getAdminPassword();
      
      if (password === correctPassword) {
        setAdminAuth(password);
        setIsAuthenticated(true);
        setPassword('');
        fetchSubmissions();
      } else {
        setAuthError('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    clearAdminAuth();
    setIsAuthenticated(false);
    setSubmissions([]);
    setSelectedSubmission(null);
    setPassword('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Subject', 'Message', 'Date'];
    const rows = submissions.map((sub) => [
      sub.id,
      sanitizeForCSV(sub.name),
      sanitizeForCSV(sub.email),
      sanitizeForCSV(sub.subject),
      sanitizeForCSV(sub.message.replace(/\n/g, ' ')),
      sanitizeForCSV(formatDate(sub.created_at)),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-tellex-dark-green flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin text-tellex-white mx-auto mb-4" size={48} />
          <p className="text-tellex-white text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-tellex-dark-green flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-tellex-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <Lock className="text-tellex-dark-green mx-auto mb-4" size={48} />
            <h1
              className="text-3xl font-bold text-tellex-dark-green mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Admin Access
            </h1>
            <p className="text-tellex-dark-green/70">Please enter the password to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-tellex-dark-green mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-tellex-dark-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-tellex-dark-green focus:border-transparent"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {authError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-tellex-dark-green hover:bg-tellex-dark-green/90 text-tellex-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Login
            </button>
          </form>
          
          {import.meta.env.DEV && (
            <p className="text-xs text-tellex-dark-green/50 mt-4 text-center">
              Development mode: Set VITE_ADMIN_PASSWORD in .env file
            </p>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-tellex-dark-green flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin text-tellex-white mx-auto mb-4" size={48} />
          <p className="text-tellex-white text-lg">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-tellex-dark-green py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1
              className="text-4xl font-bold text-tellex-white mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Contact Submissions
            </h1>
            <p className="text-tellex-white/70">
              View and manage all contact form submissions
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchSubmissions}
              className="bg-tellex-white/10 hover:bg-tellex-white/20 text-tellex-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
            {submissions.length > 0 && (
              <button
                onClick={exportToCSV}
                className="bg-tellex-white/10 hover:bg-tellex-white/20 text-tellex-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download size={18} />
                Export CSV
              </button>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600/20 hover:bg-red-600/30 text-tellex-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              title="Logout"
            >
              <Lock size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-tellex-white/10 rounded-lg p-4">
            <p className="text-tellex-white/70 text-sm mb-1">Total Submissions</p>
            <p className="text-3xl font-bold text-tellex-white">{submissions.length}</p>
          </div>
          <div className="bg-tellex-white/10 rounded-lg p-4">
            <p className="text-tellex-white/70 text-sm mb-1">This Month</p>
            <p className="text-3xl font-bold text-tellex-white">
              {submissions.filter(
                (sub) =>
                  new Date(sub.created_at).getMonth() === new Date().getMonth() &&
                  new Date(sub.created_at).getFullYear() === new Date().getFullYear()
              ).length}
            </p>
          </div>
          <div className="bg-tellex-white/10 rounded-lg p-4">
            <p className="text-tellex-white/70 text-sm mb-1">Today</p>
            <p className="text-3xl font-bold text-tellex-white">
              {submissions.filter(
                (sub) =>
                  new Date(sub.created_at).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </div>
        </div>

        {/* Submissions List */}
        {submissions.length === 0 ? (
          <div className="bg-tellex-white/10 rounded-lg p-12 text-center">
            <Mail className="text-tellex-white/50 mx-auto mb-4" size={48} />
            <p className="text-tellex-white/70 text-lg">No submissions yet</p>
            <p className="text-tellex-white/50 text-sm mt-2">
              Contact form submissions will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-tellex-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setSelectedSubmission(selectedSubmission?.id === submission.id ? null : submission)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="text-tellex-dark-green" size={20} />
                        <h3 className="text-xl font-semibold text-tellex-dark-green">
                          {sanitizeInput(submission.name)}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="text-tellex-dark-green/70" size={18} />
                        <a
                          href={`mailto:${sanitizeInput(submission.email)}`}
                          className="text-tellex-dark-green/80 hover:text-tellex-dark-green transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {sanitizeInput(submission.email)}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="text-tellex-dark-green/70" size={18} />
                        <span className="text-tellex-dark-green/70 text-sm">
                          {formatDate(submission.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="bg-tellex-dark-green/10 text-tellex-dark-green px-3 py-1 rounded-full text-sm font-medium">
                        #{submission.id}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-semibold text-tellex-dark-green mb-1">Subject:</h4>
                    <p className="text-tellex-black/80">{sanitizeInput(submission.subject)}</p>
                  </div>

                  {selectedSubmission?.id === submission.id && (
                    <div className="mt-4 pt-4 border-t border-tellex-dark-green/20">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="text-tellex-dark-green mt-1" size={18} />
                        <div className="flex-1">
                          <h4 className="font-semibold text-tellex-dark-green mb-2">Message:</h4>
                          <p className="text-tellex-black/80 whitespace-pre-wrap leading-relaxed">
                            {sanitizeInput(submission.message)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}









