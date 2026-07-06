import { ArrowLeftRight, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-navy-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <ArrowLeftRight size={15} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">MMMUT Hostel Exchange</p>
              <p className="text-white/30 text-xs">Madan Mohan Malaviya University of Technology</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/40">
            <span>Ramanujan Bhawan</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Ambedkar Bhawan</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Gorakhpur, UP</span>
          </div>

          {/* Made with love */}
          <div className="flex items-center gap-1.5 text-white/30 text-sm">
            <span>Made with</span>
            <Heart size={14} className="text-rose-400 fill-rose-400" />
            <span>for MMMUT Students</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 text-center text-white/20 text-xs">
          © {new Date().getFullYear()} MMMUT Hostel Exchange Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
