import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMe, recordExchange } from '../api/api';
import {
  User, Building, Phone, Mail, Hash, BookOpen, Calendar,
  Sparkles, Clock, Loader2, CheckCircle, AlertCircle, ArrowLeftRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getMe();
      setProfileData(res.data);
    } catch {
      toast.error('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleConfirmSwap = async () => {
    if (!profileData?.student || !profileData?.partner) return;
    const partnerName = profileData.partner.name;

    if (!window.confirm(`Are you sure you want to finalize and complete the hostel exchange with ${partnerName}?`)) {
      return;
    }

    setConfirming(true);
    try {
      await recordExchange(profileData.student._id, profileData.partner._id);
      toast.success(`🎉 Swap completed! Both of you have been moved to History.`);
      setProfileData({ student: null, partner: null });
      navigate('/history');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete swap.');
    } finally {
      setConfirming(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-grid flex items-center justify-center px-4">
        <div className="glass-card border-white/20 p-8 text-center max-w-md animate-slide-up">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
            <User size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Sign in to view your profile</h2>
          <p className="text-white/40 text-sm mb-6">
            Log in to manage your hostel exchange listing, see who you are matched with, and confirm swaps.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary mx-auto">
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb-blue absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl" />
        <div className="orb-purple absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-sm font-medium mb-4">
            <User size={14} />
            User Dashboard
          </div>
          <h1 className="section-title">My Profile & Match</h1>
          <p className="section-subtitle">Manage your listing and track your exchange status live.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 size={36} className="text-blue-400 animate-spin" />
          </div>
        ) : !profileData?.student ? (
          profileData.completedExchange ? (
            /* Case 1A: Swap Completed */
            <div className="glass-card border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-10 text-center max-w-xl mx-auto animate-fade-in glow-emerald">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                <CheckCircle size={28} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Hostel Exchange Completed! 🎉</h2>
              <p className="text-white/40 text-sm mb-6 max-w-md mx-auto leading-relaxed">
                Congratulations! Your hostel swap has been successfully finalized. Here are the details of your completed exchange:
              </p>
              
              <div className="bg-white/3 border border-white/5 rounded-2xl p-5 mb-6 text-left space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Your Swap Partner</span>
                  <span className="text-white font-semibold">
                    {profileData.completedExchange.studentA.uid === currentUser.uid 
                      ? profileData.completedExchange.studentB.name 
                      : profileData.completedExchange.studentA.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Exchanged From</span>
                  <span className="hostel-badge-ramanujan">
                    {profileData.completedExchange.studentA.uid === currentUser.uid 
                      ? profileData.completedExchange.oldHostelA 
                      : profileData.completedExchange.oldHostelB}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Exchanged To</span>
                  <span className="hostel-badge-ambedkar">
                    {profileData.completedExchange.studentA.uid === currentUser.uid 
                      ? profileData.completedExchange.oldHostelB 
                      : profileData.completedExchange.oldHostelA}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Completion Date</span>
                  <span className="text-white font-mono">
                    {new Date(profileData.completedExchange.exchangeDate).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              
              <button onClick={() => navigate('/history')} className="btn-secondary mx-auto flex items-center gap-2 w-fit">
                View Global Swap History
              </button>
            </div>
          ) : (
            /* Case 1B: No Listing Created */
            <div className="glass-card border-white/10 p-10 text-center max-w-xl mx-auto animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <User size={28} className="text-white/30" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">No Active Listing</h2>
              <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                You haven't listed your hostel exchange request yet. List yourself to find a match and swap with other students!
              </p>
              <button onClick={() => navigate('/listings')} className="btn-primary mx-auto">
                Create Your Listing
              </button>
            </div>
          )
        ) : (
          /* Case 2: Listing Exists */
          <div className="space-y-8 animate-fade-in">
            {/* Main Flex Layout */}
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              
              {/* Left Side: User Profile Card */}
              <div className="glass-card border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full">
                      Your Listing Profile
                    </span>
                    <span className="badge-looking">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {profileData.student.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                    {profileData.student.name}
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white/70">
                      <Hash size={16} className="text-blue-400" />
                      <span className="font-mono text-sm">{profileData.student.rollNumber}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/70">
                      <BookOpen size={16} className="text-blue-400" />
                      <span>{profileData.student.branch}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/70">
                      <Calendar size={16} className="text-blue-400" />
                      <span>{profileData.student.year}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/70">
                      <Phone size={16} className="text-blue-400" />
                      <span>{profileData.student.contactNumber || 'No contact provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/70">
                      <Mail size={16} className="text-blue-400" />
                      <span>{profileData.student.email}</span>
                    </div>
                  </div>
                </div>

                {/* Hostels Swap Section */}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 bg-white/3 p-4 rounded-xl">
                  <div className="flex-1 text-center">
                    <p className="text-white/30 text-xs uppercase mb-1">Current</p>
                    <span className={profileData.student.currentHostel === 'Ramanujan Bhawan' ? 'hostel-badge-ramanujan' : 'hostel-badge-ambedkar'}>
                      {profileData.student.currentHostel === 'Ramanujan Bhawan' ? 'Ramanujan' : 'Ambedkar'}
                    </span>
                  </div>
                  <ArrowLeftRight size={16} className="text-white/20" />
                  <div className="flex-1 text-center">
                    <p className="text-white/30 text-xs uppercase mb-1">Desired</p>
                    <span className={profileData.student.desiredHostel === 'Ramanujan Bhawan' ? 'hostel-badge-ramanujan' : 'hostel-badge-ambedkar'}>
                      {profileData.student.desiredHostel === 'Ramanujan Bhawan' ? 'Ramanujan' : 'Ambedkar'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Match State */}
              <div className="flex flex-col">
                {profileData.partner ? (
                  /* Case 2A: Perfect Match Found */
                  <div className="glass-card border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent p-6 sm:p-8 flex flex-col justify-between h-full glow-emerald">
                    <div>
                      <div className="flex items-center justify-between mb-6 animate-pulse">
                        <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                          <Sparkles size={10} className="fill-emerald-400" />
                          Perfect Match Found!
                        </span>
                        <span className="badge-completed">Auto-Detected</span>
                      </div>

                      <h3 className="text-2xl font-black text-white mb-6">
                        {profileData.partner.name}
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-white/70">
                          <Hash size={16} className="text-emerald-400" />
                          <span className="font-mono text-sm">{profileData.partner.rollNumber}</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/70">
                          <BookOpen size={16} className="text-emerald-400" />
                          <span>{profileData.partner.branch}</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/70">
                          <Calendar size={16} className="text-emerald-400" />
                          <span>{profileData.partner.year}</span>
                        </div>
                        <div className="flex items-center gap-3 text-white/70">
                          <Phone size={16} className="text-emerald-400" />
                          <span>{profileData.partner.contactNumber || 'No contact provided'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      {/* Hostel swap visualization */}
                      <div className="flex items-center gap-3 bg-white/3 p-4 rounded-xl border border-white/5">
                        <div className="flex-1 text-center">
                          <p className="text-white/30 text-xs uppercase mb-1">Has</p>
                          <span className={profileData.partner.currentHostel === 'Ramanujan Bhawan' ? 'hostel-badge-ramanujan' : 'hostel-badge-ambedkar'}>
                            {profileData.partner.currentHostel === 'Ramanujan Bhawan' ? 'Ramanujan' : 'Ambedkar'}
                          </span>
                        </div>
                        <ArrowLeftRight size={16} className="text-white/20 animate-pulse" />
                        <div className="flex-1 text-center">
                          <p className="text-white/30 text-xs uppercase mb-1">Wants</p>
                          <span className={profileData.partner.desiredHostel === 'Ramanujan Bhawan' ? 'hostel-badge-ramanujan' : 'hostel-badge-ambedkar'}>
                            {profileData.partner.desiredHostel === 'Ramanujan Bhawan' ? 'Ramanujan' : 'Ambedkar'}
                          </span>
                        </div>
                      </div>

                      {/* Confirm Action Button */}
                      <button
                        onClick={handleConfirmSwap}
                        disabled={confirming}
                        className="w-full btn-emerald py-3 flex items-center justify-center gap-2 text-sm font-semibold glow-emerald"
                      >
                        {confirming ? (
                          <><Loader2 size={16} className="animate-spin" /> Finalizing...</>
                        ) : (
                          <><CheckCircle size={16} /> Confirm Swap & Complete</>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Case 2B: No Match Yet (Waiting) */
                  <div className="glass-card border-white/10 p-6 sm:p-8 flex flex-col justify-center items-center text-center h-full">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                      <Clock size={28} className="text-amber-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Match Yet</h3>
                    <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed mb-6">
                      You are currently on the waiting list. The matchmaking engine will pair you as soon as a student from the other hostel registers wanting to swap.
                    </p>
                    <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-4 py-2 rounded-full">
                      <AlertCircle size={12} />
                      Waiting for partners from the other hostel
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
