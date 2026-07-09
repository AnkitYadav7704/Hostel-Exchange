import { useState } from 'react';
import { User, Hash, BookOpen, Calendar, Building, ArrowRight, Phone, ChevronDown, Lock, Star, AlertCircle } from 'lucide-react';
import { updateStudentStatus, deleteStudent } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const statusBadge = {
  'Looking for Exchange': 'badge-looking',
  'Match Found': 'badge-found',
  'Exchange Completed': 'badge-completed',
};

const statusDot = {
  'Looking for Exchange': 'bg-amber-400',
  'Match Found': 'bg-blue-400',
  'Exchange Completed': 'bg-emerald-400',
};

const hostelBadge = (hostel) => {
  if (hostel === 'Ramanujan Bhawan') return 'hostel-badge-ramanujan';
  if (hostel === 'Ambedkar Bhawan') return 'hostel-badge-ambedkar';
  if (hostel === 'Kasturba Bhawan') return 'hostel-badge-kasturba';
  if (hostel === 'Kalpana Bhawan') return 'hostel-badge-kalpana';
  return 'bg-white/10 text-white/60';
};

export default function ListingCard({ student, onUpdate, onDelete, onAccept, myListing }) {
  const [loading, setLoading] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const isOwner = currentUser && currentUser.uid === student.uid;
  const isMatch = myListing &&
                  myListing.currentHostel === student.desiredHostel &&
                  myListing.desiredHostel === student.currentHostel;
  const statuses = ['Looking for Exchange', 'Match Found'];

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    setShowStatusMenu(false);
    try {
      await updateStudentStatus(student._id, newStatus);
      toast.success(`Status updated to "${newStatus}"`);
      onUpdate?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Remove your listing?`)) return;
    try {
      await deleteStudent(student._id);
      toast.success('Your listing has been removed.');
      onDelete?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove listing');
    }
  };

  const handleAcceptClick = () => {
    if (!currentUser) {
      toast.error('Please sign in to accept this exchange.');
      navigate('/login');
      return;
    }
    onAccept?.(student);
  };

  return (
    <div className={`glass-card-hover p-5 animate-fade-in group relative ${
      isOwner ? 'border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-transparent' : ''
    }`}>
      {/* "Your Listing" badge for owner */}
      {isOwner && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-blue-500/20 border border-blue-500/30 
                        text-blue-400 text-xs font-semibold px-2 py-0.5 rounded-full">
          <Star size={9} className="fill-blue-400" />
          Your Listing
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 
                          flex items-center justify-center border border-white/10 flex-shrink-0">
            <User size={18} className="text-blue-300" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base pr-16">{student.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Hash size={11} className="text-white/30" />
              <span className="text-white/40 text-xs font-mono">{student.rollNumber}</span>
            </div>
          </div>
        </div>
        {!isOwner && (
          <div className={`${statusBadge[student.status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot[student.status]}`} />
            {student.status}
          </div>
        )}
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-white/50">
          <BookOpen size={13} className="text-white/30" />
          <span className="truncate">{student.branch}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Calendar size={13} className="text-white/30" />
          <span>{student.year}</span>
        </div>
        {student.contactNumber && (
          <div className="col-span-2 flex items-center gap-2 text-sm text-white/50">
            <Phone size={13} className="text-white/30" />
            <span>{student.contactNumber}</span>
          </div>
        )}
      </div>

      {/* Hostel exchange visualization */}
      <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5 mb-4">
        <span className={hostelBadge(student.currentHostel)}>
          <Building size={10} />
          {student.currentHostel.replace(' Bhawan', '')}
        </span>
        <ArrowRight size={14} className="text-white/30 flex-shrink-0 mx-auto" />
        <span className={hostelBadge(student.desiredHostel)}>
          <Building size={10} />
          {student.desiredHostel.replace(' Bhawan', '')}
        </span>
      </div>

      {/* Status badge for owner (below hostel row) */}
      {isOwner && (
        <div className={`${statusBadge[student.status]} mb-4`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[student.status]}`} />
          {student.status}
        </div>
      )}

      {/* Actions */}
      {isOwner ? (
        <div className="flex items-center gap-2 relative">
          <div className="relative flex-1">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              disabled={loading}
              className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 
                         border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 
                         text-xs text-white/60 transition-all duration-200"
            >
              <span>Update Status</span>
              <ChevronDown
                size={12}
                className={`transition-transform ${showStatusMenu ? 'rotate-180' : ''}`}
              />
            </button>
            {showStatusMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-navy-700 border border-white/10 
                              rounded-xl overflow-hidden shadow-xl z-10 animate-fade-in">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/5
                                ${student.status === s ? 'text-blue-400 bg-blue-500/10' : 'text-white/60'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleDelete} className="btn-danger text-xs px-3 py-2">
            Remove
          </button>
        </div>
      ) : (
        /* Non-owner actions */
        <div className="w-full space-y-2">
          {student.status === 'Looking for Exchange' && (
            myListing ? (
              isMatch ? (
                <button
                  onClick={handleAcceptClick}
                  className="w-full btn-emerald text-xs py-2.5 flex items-center justify-center gap-1.5 hover:scale-100 active:scale-95"
                >
                  <ArrowRight size={13} className="rotate-180" />
                  Accept Swap
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-white/5 border border-white/5 text-white/20 text-xs py-2.5 rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <AlertCircle size={13} className="text-white/20" />
                  Incompatible Swap
                </button>
              )
            ) : (
              /* User doesn't have a listing or is logged out */
              <button
                onClick={handleAcceptClick}
                className="w-full btn-emerald text-xs py-2.5 flex items-center justify-center gap-1.5 hover:scale-100 active:scale-95"
              >
                <ArrowRight size={13} className="rotate-180" />
                Accept Swap
              </button>
            )
          )}
          {!currentUser && (
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-1.5 text-white/25 text-xs 
                         hover:text-white/40 transition-colors py-1"
            >
              <Lock size={10} />
              Sign in to manage your own listing
            </button>
          )}
        </div>
      )}

      {/* Date */}
      <p className="text-white/20 text-xs mt-3 text-right">
        Listed {new Date(student.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric',
        })}
      </p>
    </div>
  );
}
