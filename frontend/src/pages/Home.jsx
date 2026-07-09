import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2, ArrowLeftRight, CheckCircle, Sparkles,
  Search, TrendingUp, ChevronRight, Zap
} from 'lucide-react';
import { getStats } from '../api/api';
import StatCard from '../components/StatCard';

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((r) => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/listings?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-grid">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb-blue absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl" />
        <div className="orb-purple absolute top-40 right-10 w-80 h-80 rounded-full blur-3xl" />
        <div className="orb-emerald absolute bottom-20 left-1/2 w-72 h-72 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-sm font-medium mb-6">
            <Zap size={14} className="fill-blue-400" />
            MMMUT Hostel Exchange Portal
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Find Your
            <br />
            <span className="gradient-text">Perfect Match</span>
          </h1>

          <p className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Exchange your hostel at MMMUT — instantly, transparently, and without the WhatsApp chaos. Supports boys' and girls' hostels.
          </p>

          {/* Quick Search */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-8">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-11 pr-28 py-4 text-base shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => navigate('/listings')} className="btn-primary flex items-center gap-2 text-base">
              <ArrowLeftRight size={18} />
              List Yourself
            </button>
            <button onClick={() => navigate('/listings')} className="btn-secondary flex items-center gap-2 text-base">
              <Search size={18} />
              Browse Listings
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-white/50 text-sm mb-2">
              <TrendingUp size={14} />
              Live Statistics
            </div>
            <h2 className="section-title">Exchange at a Glance</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            <StatCard
              icon={Users}
              label="Total Students"
              value={loading ? '...' : stats?.total ?? 0}
              color="blue"
              delay="animation-delay-100"
            />
            <StatCard
              icon={Building2}
              label="Ramanujan"
              value={loading ? '...' : stats?.ramanujan ?? 0}
              color="purple"
              delay="animation-delay-200"
            />
            <StatCard
              icon={Building2}
              label="Ambedkar"
              value={loading ? '...' : stats?.ambedkar ?? 0}
              color="blue"
              delay="animation-delay-300"
            />
            <StatCard
              icon={Building2}
              label="Kasturba"
              value={loading ? '...' : stats?.kasturba ?? 0}
              color="rose"
              delay="animation-delay-300"
            />
            <StatCard
              icon={Building2}
              label="Kalpana"
              value={loading ? '...' : stats?.kalpana ?? 0}
              color="emerald"
              delay="animation-delay-350"
            />
            <StatCard
              icon={Sparkles}
              label="Possible Matches"
              value={loading ? '...' : stats?.possibleMatches ?? 0}
              color="emerald"
              delay="animation-delay-400"
            />
            <StatCard
              icon={CheckCircle}
              label="Completed"
              value={loading ? '...' : stats?.completed ?? 0}
              color="amber"
              delay="animation-delay-400"
            />
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to swap your hostel</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: Users,
                title: 'List Yourself',
                desc: 'Register your exchange request with your hostel details.',
                color: 'blue',
              },
              {
                step: '02',
                icon: Sparkles,
                title: 'Accept Swap',
                desc: 'Browse listings and accept a swap directly from another card.',
                color: 'emerald',
              },
              {
                step: '03',
                icon: CheckCircle,
                title: 'Complete Exchange',
                desc: 'Confirm details and instantly finalize your exchange.',
                color: 'amber',
              },
            ].map(({ step, icon: Icon, title, desc, color }) => (
              <div key={step} className="glass-card-hover p-6 text-center group">
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4
                                 bg-${color}-500/20 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} className={`text-${color}-400`} />
                </div>
                <div className={`text-${color}-400/50 text-xs font-bold mb-2`}>{step}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'All Listings', desc: 'Browse all exchange requests', path: '/listings', color: 'blue', icon: Users },
            { label: 'List Yourself', desc: 'Register your exchange request', path: '/listings', color: 'purple', icon: ArrowLeftRight },
            { label: 'History', desc: 'Completed exchange records', path: '/history', color: 'amber', icon: CheckCircle },
          ].map(({ label, desc, path, color, icon: Icon }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="glass-card-hover p-5 text-left group flex items-start justify-between"
            >
              <div>
                <div className={`w-9 h-9 rounded-lg bg-${color}-500/20 flex items-center justify-center mb-3
                                 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={18} className={`text-${color}-400`} />
                </div>
                <p className="text-white font-semibold text-sm">{label}</p>
                <p className="text-white/40 text-xs mt-1">{desc}</p>
              </div>
              <ChevronRight size={16} className="text-white/20 group-hover:text-white/50 transition-colors mt-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
