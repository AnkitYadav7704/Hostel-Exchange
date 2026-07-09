import { Sparkles, User, Hash, BookOpen, Calendar, Building, Phone, ArrowLeftRight, CheckCircle } from 'lucide-react';
import { recordExchange } from '../api/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

const hostelBadge = (hostel) => {
  if (hostel === 'Ramanujan Bhawan') return 'hostel-badge-ramanujan';
  if (hostel === 'Ambedkar Bhawan') return 'hostel-badge-ambedkar';
  if (hostel === 'Kasturba Bhawan') return 'hostel-badge-kasturba';
  if (hostel === 'Kalpana Bhawan') return 'hostel-badge-kalpana';
  return 'bg-white/10 text-white/60';
};

const HostelBadge = ({ hostel }) => (
  <span className={hostelBadge(hostel)}>
    <Building size={10} />
    {hostel}
  </span>
);

const StudentPanel = ({ student, side }) => (
  <div className={`flex-1 p-4 rounded-xl border ${
    side === 'A'
      ? 'bg-purple-500/10 border-purple-500/20'
      : 'bg-blue-500/10 border-blue-500/20'
  }`}>
    <div className="flex items-center gap-2 mb-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
        side === 'A' ? 'bg-purple-500/20' : 'bg-blue-500/20'
      }`}>
        <User size={15} className={side === 'A' ? 'text-purple-300' : 'text-blue-300'} />
      </div>
      <div>
        <p className="font-semibold text-white text-sm">{student.name}</p>
        <div className="flex items-center gap-1">
          <Hash size={10} className="text-white/30" />
          <span className="text-white/40 text-xs font-mono">{student.rollNumber}</span>
        </div>
      </div>
    </div>
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs text-white/50">
        <BookOpen size={11} className="text-white/30" />
        {student.branch}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-white/50">
        <Calendar size={11} className="text-white/30" />
        {student.year}
      </div>
      {student.contactNumber && (
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <Phone size={11} className="text-white/30" />
          {student.contactNumber}
        </div>
      )}
    </div>
    <div className="mt-3 pt-3 border-t border-white/10">
      <HostelBadge hostel={student.currentHostel} />
    </div>
  </div>
);

export default function MatchCard({ match, index, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await recordExchange(match.studentA._id, match.studentB._id);
      toast.success('🎉 Exchange confirmed! Both students moved to History.');
      setConfirmed(true);
      onConfirm?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm exchange');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card-hover p-5 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent animate-slide-up glow-emerald">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Sparkles size={14} className="text-emerald-400" />
          </div>
          <span className="text-emerald-400 font-semibold text-sm">Perfect Match #{index + 1}</span>
        </div>
        <div className="badge-completed">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Auto-Detected
        </div>
      </div>

      {/* Students side by side */}
      <div className="flex items-stretch gap-3 mb-4">
        <StudentPanel student={match.studentA} side="A" />

        <div className="flex flex-col items-center justify-center flex-shrink-0 gap-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 
                          border border-emerald-500/30 flex items-center justify-center">
            <ArrowLeftRight size={14} className="text-emerald-400" />
          </div>
          <span className="text-emerald-400/50 text-xs font-medium">swap</span>
        </div>

        <StudentPanel student={match.studentB} side="B" />
      </div>

      {/* Exchange Summary */}
      <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl mb-4 text-xs text-white/50">
        <CheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
        <span>
          <span className="text-emerald-300">{match.studentA.name}</span> from <strong className="text-white/70">{match.studentA.currentHostel.replace(' Bhawan', '')}</strong> ↔{' '}
          <span className="text-emerald-300">{match.studentB.name}</span> from <strong className="text-white/70">{match.studentB.currentHostel.replace(' Bhawan', '')}</strong>
        </span>
      </div>

      {/* Confirm button */}
      {!confirmed ? (
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="btn-emerald w-full text-sm"
        >
          {loading ? 'Confirming...' : '✓ Confirm Exchange'}
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 py-3 text-emerald-400 font-semibold text-sm">
          <CheckCircle size={16} />
          Exchange Confirmed!
        </div>
      )}
    </div>
  );
}
