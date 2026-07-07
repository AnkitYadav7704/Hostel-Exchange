import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Menu, X, LogIn, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/listings', label: 'Listings' },
  { to: '/room-partner', label: 'Find Room Partner' },
  { to: '/history', label: 'History' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const dropdownRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    await logout();
    toast.success('Signed out successfully.');
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-navy-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 
                            flex items-center justify-center shadow-lg shadow-blue-500/30
                            group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
              <ArrowLeftRight className="text-white" size={18} />
            </div>
            <div>
              <span className="font-bold text-white text-sm leading-none">MMMUT</span>
              <p className="text-white/40 text-xs leading-none mt-0.5">Hostel Exchange</p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side — Auth */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              /* Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 
                             hover:border-white/20 rounded-xl px-3 py-2 transition-all duration-200"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="avatar"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center">
                      <User size={13} className="text-blue-300" />
                    </div>
                  )}
                  <span className="text-white text-sm font-medium max-w-[120px] truncate">
                    {currentUser.displayName?.split(' ')[0] || 'You'}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`text-white/40 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-navy-700 border border-white/10 
                                  rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white text-sm font-semibold truncate">
                        {currentUser.displayName || 'Student'}
                      </p>
                      <p className="text-white/40 text-xs truncate">{currentUser.email}</p>
                    </div>
                    {/* Actions */}
                    <button
                      onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:text-white 
                                 hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                      <User size={13} className="text-white/60" />
                      My Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 
                                 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={13} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
              >
                <LogIn size={15} />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-800/95 backdrop-blur-xl border-t border-white/10 animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Mobile Auth */}
            <div className="pt-2 border-t border-white/10 mt-2">
              {currentUser ? (
                <div>
                  <div className="flex items-center gap-2 px-4 py-2.5 mb-1">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="avatar" className="w-6 h-6 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center">
                        <User size={12} className="text-blue-300" />
                      </div>
                    )}
                    <span className="text-white text-sm font-medium">
                      {currentUser.displayName?.split(' ')[0] || 'Student'}
                    </span>
                  </div>
                  <button
                    onClick={() => { navigate('/profile'); setMobileOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 
                               rounded-lg transition-colors flex items-center gap-2 mb-1"
                  >
                    <User size={13} />
                    My Profile
                  </button>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 
                               rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut size={13} />
                    Sign Out
                  </button>
                </div>

              ) : (
                <button
                  onClick={() => { navigate('/login'); setMobileOpen(false); }}
                  className="btn-primary w-full text-sm flex items-center justify-center gap-2"
                >
                  <LogIn size={15} />
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
