import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Plus, X, Loader2, Users, LogIn, ArrowRight } from 'lucide-react';
import { getStudents, createStudent, recordExchange } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import ListingCard from '../components/ListingCard';
import toast from 'react-hot-toast';

const BRANCHES = ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE', 'CH', 'MCA', 'MBA', 'Other'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const HOSTELS = ['Ramanujan Bhawan', 'Ambedkar Bhawan', 'Kasturba Bhawan', 'Kalpana Bhawan'];
const STATUSES = ['Looking for Exchange', 'Match Found', 'Exchange Completed'];

const getCompatibleHostel = (hostel) => {
  const compat = {
    'Ramanujan Bhawan': 'Ambedkar Bhawan',
    'Ambedkar Bhawan': 'Ramanujan Bhawan',
    'Kasturba Bhawan': 'Kalpana Bhawan',
    'Kalpana Bhawan': 'Kasturba Bhawan',
  };
  return compat[hostel] || '';
};

const defaultForm = {
  name: '', rollNumber: '', branch: '', year: '',
  currentHostel: '', desiredHostel: '', contactNumber: '',
};

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [acceptingTargetStudent, setAcceptingTargetStudent] = useState(null);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    currentHostel: '',
    desiredHostel: '',
    branch: '',
    year: '',
    status: '',
  });

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const res = await getStudents(params);
      setStudents(res.data);
    } catch {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', currentHostel: '', desiredHostel: '', branch: '', year: '', status: '' });
    setSearchParams({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const myListing = currentUser && students.find(s => s.uid === currentUser.uid);

  // Auth-gated modal open
  const openModal = () => {
    if (!currentUser) {
      toast.error('Please sign in to create a listing.');
      navigate('/login');
      return;
    }
    setAcceptingTargetStudent(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const handleAcceptSwap = async (targetStudent) => {
    if (myListing) {
      const isMatch = myListing.currentHostel === targetStudent.desiredHostel &&
                      myListing.desiredHostel === targetStudent.currentHostel;
      if (isMatch) {
        if (window.confirm(`Swap hostels with ${targetStudent.name} immediately?`)) {
          try {
            await recordExchange(myListing._id, targetStudent._id);
            toast.success(`🎉 Swap completed! Both of you have been moved to History.`);
            fetchStudents();
          } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to complete swap.');
          }
        }
      } else {
        toast.error(`Incompatible Swap: Your listing (${myListing.currentHostel} → ${myListing.desiredHostel}) does not match ${targetStudent.name}'s request (${targetStudent.currentHostel} → ${targetStudent.desiredHostel}).`);
      }
    } else {
      setAcceptingTargetStudent(targetStudent);
      setForm({
        name: '',
        rollNumber: '',
        branch: '',
        year: '',
        currentHostel: targetStudent.desiredHostel,
        desiredHostel: targetStudent.currentHostel,
        contactNumber: '',
      });
      setShowModal(true);
    }
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.currentHostel === form.desiredHostel) {
      toast.error('Current and desired hostel must be different!');
      return;
    }
    setSubmitting(true);
    try {
      const res = await createStudent(form);
      if (acceptingTargetStudent) {
        await recordExchange(res.data._id, acceptingTargetStudent._id);
        toast.success(`🎉 Swap successfully completed with ${acceptingTargetStudent.name}! Both moved to History.`);
        setAcceptingTargetStudent(null);
      } else {
        toast.success('Your listing has been created! 🎉');
      }
      setShowModal(false);
      setForm(defaultForm);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">Exchange Listings</h1>
            <p className="section-subtitle">
              {loading ? 'Loading...' : `${students.length} student${students.length !== 1 ? 's' : ''} looking for exchange`}
            </p>
          </div>
          <button onClick={openModal} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
            <Plus size={18} />
            List Yourself
          </button>
        </div>

        {/* Search & Filters bar */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-9 py-2.5"
              />
            </div>
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200
                ${showFilters || activeFilterCount > 0
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors">
                <X size={14} />
                Clear
              </button>
            )}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Current Hostel</label>
                <select
                  value={filters.currentHostel}
                  onChange={(e) => handleFilterChange('currentHostel', e.target.value)}
                  className="select-field py-2"
                >
                  <option value="">All Hostels</option>
                  {HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Desired Hostel</label>
                <select
                  value={filters.desiredHostel}
                  onChange={(e) => handleFilterChange('desiredHostel', e.target.value)}
                  className="select-field py-2"
                >
                  <option value="">All Hostels</option>
                  {HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Branch</label>
                <select
                  value={filters.branch}
                  onChange={(e) => handleFilterChange('branch', e.target.value)}
                  className="select-field py-2"
                >
                  <option value="">All Branches</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="select-field py-2"
                >
                  <option value="">All Years</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="select-field py-2"
                >
                  <option value="">All Statuses</option>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Listing Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="text-blue-400 animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Users size={28} className="text-white/20" />
            </div>
            <p className="text-white/40 text-lg font-medium mb-2">No listings found</p>
            <p className="text-white/25 text-sm mb-6">
              {activeFilterCount > 0 ? 'Try adjusting your filters' : 'Be the first to list yourself!'}
            </p>
            {currentUser ? (
              <button onClick={openModal} className="btn-primary">
                + Create First Listing
              </button>
            ) : (
              <button onClick={() => navigate('/login')} className="btn-primary flex items-center gap-2 mx-auto">
                <LogIn size={16} />
                Sign In to List Yourself
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {students.map((s) => (
              <ListingCard
                key={s._id}
                student={s}
                onUpdate={fetchStudents}
                onDelete={fetchStudents}
                onAccept={handleAcceptSwap}
                myListing={myListing}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Listing Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up border-white/20">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {acceptingTargetStudent ? 'Accept Hostel Swap' : 'Create Exchange Listing'}
                  </h2>
                  <p className="text-white/40 text-sm mt-1">
                    {acceptingTargetStudent 
                      ? `Complete your details to swap with ${acceptingTargetStudent.name}`
                      : 'Fill in your details to find an exchange partner'}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {acceptingTargetStudent && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                  <ArrowRight size={14} className="rotate-180 flex-shrink-0" />
                  <span>
                    You are swapping with <strong>{acceptingTargetStudent.name}</strong>. 
                    Your swap details are locked as: <strong>{form.currentHostel}</strong> → <strong>{form.desiredHostel}</strong>.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs text-white/50 mb-1.5">Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Ankit Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Roll Number *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. 2201640100001"
                      value={form.rollNumber}
                      onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Branch *</label>
                    <select
                      required
                      value={form.branch}
                      onChange={(e) => setForm({ ...form, branch: e.target.value })}
                      className="select-field"
                    >
                      <option value="">Select Branch</option>
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Year *</label>
                    <select
                      required
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      className="select-field"
                    >
                      <option value="">Select Year</option>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Current Hostel *</label>
                    <select
                      required
                      disabled={!!acceptingTargetStudent}
                      value={form.currentHostel}
                      onChange={(e) => {
                        const current = e.target.value;
                        const desired = getCompatibleHostel(current);
                        setForm({ ...form, currentHostel: current, desiredHostel: desired });
                      }}
                      className="select-field disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Hostel</option>
                      {HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Desired Hostel *</label>
                    <select
                      required
                      disabled
                      value={form.desiredHostel}
                      onChange={(e) => setForm({ ...form, desiredHostel: e.target.value })}
                      className="select-field disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <option value="">Auto-selected</option>
                      {HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-white/50 mb-1.5">Contact Number <span className="text-white/25">(optional)</span></label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={form.contactNumber}
                      onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                    ) : acceptingTargetStudent ? (
                      'Accept & Complete Swap'
                    ) : (
                      'Create Listing'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
