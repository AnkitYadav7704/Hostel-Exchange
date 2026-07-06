import { useState, useEffect } from 'react';
import { History, Loader2, ArrowLeftRight, Calendar, Building, User, Hash } from 'lucide-react';
import { getHistory } from '../api/api';
import toast from 'react-hot-toast';

const HostelPill = ({ hostel }) => (
  <span className={hostel === 'Ramanujan Bhawan' ? 'hostel-badge-ramanujan' : 'hostel-badge-ambedkar'}>
    <Building size={9} />
    {hostel === 'Ramanujan Bhawan' ? 'Ramanujan' : 'Ambedkar'}
  </span>
);

export default function ExchangeHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then((r) => setHistory(r.data))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-grid">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 text-amber-400 text-sm font-medium mb-4">
            <History size={14} />
            Completed Exchanges
          </div>
          <h1 className="section-title">Exchange History</h1>
          <p className="section-subtitle">
            A record of all successfully completed hostel exchanges at MMMUT.
          </p>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="glass-card px-5 py-4 mb-8 flex items-center gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <History size={16} className="text-amber-400" />
            </div>
            <div>
              <span className="text-amber-400 font-bold text-lg">{history.length}</span>
              <span className="text-white/50 text-sm ml-2">Total Exchange{history.length !== 1 ? 's' : ''} Completed</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="text-amber-400 animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <History size={28} className="text-white/20" />
            </div>
            <p className="text-white/40 text-lg font-medium mb-2">No Exchanges Recorded</p>
            <p className="text-white/25 text-sm">Confirmed exchanges will appear here once students complete their swap.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((record, idx) => (
              <div
                key={record._id}
                className="glass-card-hover p-6 animate-slide-up border-amber-500/10 bg-gradient-to-br from-amber-500/3 to-transparent"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Student A */}
                  <div className="flex-1 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-purple-300" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{record.studentA.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 mb-2">
                        <Hash size={10} className="text-white/30" />
                        <span className="text-white/40 text-xs font-mono">{record.studentA.rollNumber}</span>
                        <span className="text-white/20">·</span>
                        <span className="text-white/40 text-xs">{record.studentA.branch}</span>
                        <span className="text-white/20">·</span>
                        <span className="text-white/40 text-xs">{record.studentA.year}</span>
                      </div>
                      <HostelPill hostel={record.oldHostelA} />
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex lg:flex-col items-center gap-2 lg:gap-1 self-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/20 
                                    border border-amber-500/30 flex items-center justify-center">
                      <ArrowLeftRight size={15} className="text-amber-400" />
                    </div>
                    <span className="text-amber-400/50 text-xs font-medium">swapped</span>
                  </div>

                  {/* Student B */}
                  <div className="flex-1 flex items-start gap-3 lg:justify-end lg:text-right">
                    <div className="lg:order-last w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-blue-300" />
                    </div>
                    <div className="lg:text-right">
                      <p className="font-semibold text-white">{record.studentB.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 mb-2 lg:justify-end">
                        <Hash size={10} className="text-white/30" />
                        <span className="text-white/40 text-xs font-mono">{record.studentB.rollNumber}</span>
                        <span className="text-white/20">·</span>
                        <span className="text-white/40 text-xs">{record.studentB.branch}</span>
                        <span className="text-white/20">·</span>
                        <span className="text-white/40 text-xs">{record.studentB.year}</span>
                      </div>
                      <HostelPill hostel={record.oldHostelB} />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-white/30 text-xs">
                  <Calendar size={12} />
                  <span>
                    Exchanged on{' '}
                    {new Date(record.exchangeDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
