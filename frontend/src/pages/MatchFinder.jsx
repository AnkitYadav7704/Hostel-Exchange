import { useState, useEffect } from 'react';
import { Sparkles, Loader2, ArrowLeftRight, Users, AlertCircle, LogIn, UserX, Clock } from 'lucide-react';
import { getMatches } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MatchCard from '../components/MatchCard';
import toast from 'react-hot-toast';

export default function MatchFinder() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await getMatches();
      setData(res.data);
    } catch {
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMatches(); }, []);

  // For logged-in users: only the match that includes them
  const myMatch = currentUser && data?.matches
    ? data.matches.find(
        (m) => m.studentA.uid === currentUser.uid || m.studentB.uid === currentUser.uid
      )
    : null;

  // Check if the logged-in user is in the unmatched waiting list
  const isWaiting = currentUser && data
    ? [...(data.unmatchedRamanujan || []), ...(data.unmatchedAmbedkar || [])].some(
        (s) => s.uid === currentUser.uid
      )
    : false;

  // Check if user has no listing at all
  const hasNoListing = currentUser && data && !myMatch && !isWaiting;

  return (
    <div className="min-h-screen bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium mb-4">
            <Sparkles size={14} />
            Auto-Detection Active
          </div>
          <h1 className="section-title text-4xl">Smart Match Finder</h1>
          <p className="section-subtitle max-w-xl mx-auto mt-2">
            {currentUser
              ? 'Showing your personal match result. The system pairs students from opposite hostels automatically.'
              : 'Sign in to see your personal match. The system pairs students from opposite hostels automatically.'}
          </p>
        </div>

        {/* Not signed in — prompt */}
        {!currentUser && (
          <div className="glass-card border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent p-8 text-center mb-8 animate-fade-in">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4">
              <LogIn size={24} className="text-blue-400" />
            </div>
            <h2 className="text-white font-semibold text-lg mb-2">Sign in to see your match</h2>
            <p className="text-white/40 text-sm mb-5 max-w-sm mx-auto">
              Create a listing and the system will automatically find your perfect exchange partner.
            </p>
            <button onClick={() => navigate('/login')} className="btn-primary mx-auto flex items-center gap-2 w-fit">
              <LogIn size={16} />
              Sign In with Google
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="text-emerald-400 animate-spin" />
          </div>
        ) : currentUser ? (
          /* ── Logged-in view ── */
          <>
            {/* User has a match */}
            {myMatch ? (
              <div className="max-w-2xl mx-auto animate-slide-up">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-emerald-400" />
                  <span className="text-emerald-400 font-semibold text-sm">Your Perfect Match Found!</span>
                </div>
                <MatchCard match={myMatch} index={0} onConfirm={fetchMatches} />
              </div>
            ) : isWaiting ? (
              /* User listed but no match yet */
              <div className="text-center py-20 animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5">
                  <Clock size={28} className="text-amber-400" />
                </div>
                <p className="text-white font-semibold text-xl mb-2">No Match Found Yet</p>
                <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed mb-6">
                  Your listing is active. As soon as a student from the other hostel registers wanting to swap with you, your match will appear here automatically.
                </p>
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 text-amber-400 text-sm">
                  <AlertCircle size={13} />
                  Waiting for a partner from the other hostel
                </div>
              </div>
            ) : (
              /* User has no listing */
              <div className="text-center py-20 animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                  <UserX size={28} className="text-white/20" />
                </div>
                <p className="text-white font-semibold text-xl mb-2">No Active Listing</p>
                <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed mb-6">
                  You haven't created a hostel exchange listing yet. Create one and we'll automatically find your match!
                </p>
                <button onClick={() => navigate('/listings')} className="btn-primary mx-auto flex items-center gap-2 w-fit">
                  + Create Your Listing
                </button>
              </div>
            )}

            {/* Overall stats for context */}
            {data && (
              <div className="mt-12 pt-8 border-t border-white/5">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-4 text-center">Platform Overview</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <div className="glass-card px-4 py-2.5 flex items-center gap-2">
                    <Sparkles size={13} className="text-emerald-400" />
                    <span className="text-emerald-400 font-bold">{data.totalMatches}</span>
                    <span className="text-white/40 text-sm">Total Matches</span>
                  </div>
                  {data.unmatchedRamanujan?.length > 0 && (
                    <div className="glass-card px-4 py-2.5 flex items-center gap-2">
                      <AlertCircle size={13} className="text-amber-400" />
                      <span className="text-amber-400 font-bold">{data.unmatchedRamanujan.length}</span>
                      <span className="text-white/40 text-sm">Waiting from Ramanujan</span>
                    </div>
                  )}
                  {data.unmatchedAmbedkar?.length > 0 && (
                    <div className="glass-card px-4 py-2.5 flex items-center gap-2">
                      <AlertCircle size={13} className="text-amber-400" />
                      <span className="text-amber-400 font-bold">{data.unmatchedAmbedkar.length}</span>
                      <span className="text-white/40 text-sm">Waiting from Ambedkar</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
