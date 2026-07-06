export default function StatCard({ icon: Icon, label, value, color, gradient, delay = '' }) {
  const colorMap = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/20 text-rose-400',
  };

  const iconBg = {
    blue: 'bg-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    purple: 'bg-purple-500/20 text-purple-400',
    amber: 'bg-amber-500/20 text-amber-400',
    rose: 'bg-rose-500/20 text-rose-400',
  };

  return (
    <div
      className={`animate-slide-up ${delay} glass-card-hover bg-gradient-to-br ${colorMap[color]} p-6 group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg[color]}
                         group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={22} />
        </div>
        <div className={`text-3xl font-bold ${colorMap[color].split(' ').find(c => c.startsWith('text-'))}`}>
          {value ?? '—'}
        </div>
      </div>
      <p className="text-white/60 text-sm font-medium">{label}</p>
    </div>
  );
}
