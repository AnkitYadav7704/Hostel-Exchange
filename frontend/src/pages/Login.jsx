import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeftRight, LogIn, Shield, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Already logged in
  if (currentUser) {
    navigate('/');
    return null;
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await login();
      toast.success('Welcome! You are now signed in. 🎉');
      navigate(-1);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        toast.error('Sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center px-4">
      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb-blue absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl" />
        <div className="orb-purple absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="glass-card border-white/20 p-8 text-center animate-slide-up">
          {/* Logo */}
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 
                          flex items-center justify-center shadow-xl shadow-blue-500/30 mb-6">
            <ArrowLeftRight size={28} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Sign in to MMMUT</h1>
          <p className="text-white/40 text-sm mb-8">
            Hostel Exchange Portal — sign in with your Google account to create and manage your exchange listing.
          </p>

          {/* Features */}
          <div className="space-y-3 mb-8 text-left">
            {[
              { icon: Shield, text: 'Your listing is protected — only you can edit or remove it', color: 'emerald' },
              { icon: Zap, text: 'Instantly find matching exchange partners', color: 'blue' },
              { icon: LogIn, text: 'Sign in once — stays logged in across sessions', color: 'purple' },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-md bg-${color}-500/20 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <Icon size={12} className={`text-${color}-400`} />
                </div>
                <p className="text-white/50 text-sm">{text}</p>
              </div>
            ))}
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 
                       text-gray-800 font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 
                       hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="text-gray-500">Signing in...</span>
            ) : (
              <>
                {/* Google Logo SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <p className="text-white/20 text-xs mt-5">
            By signing in, you agree to use this platform for MMMUT hostel exchange only.
          </p>
        </div>
      </div>
    </div>
  );
}
