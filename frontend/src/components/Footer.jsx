import React from 'react'
import { ShieldCheck } from 'lucide-react'

export default function Footer({ onOpenDashboard }) {
  return (
    <footer className="w-full bg-[#071b33] border-t border-[#163863] text-slate-300 text-xs py-6 px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-300">
        
        {/* Left: Identification */}
        <div className="flex items-center gap-2 text-center md:text-left">
          <span className="font-semibold text-white">
            © 2026 National Airfare Index System
          </span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline text-slate-300">Autonomous Airfare Indexing</span>
        </div>

        {/* Right: Operational Health & Admin Link */}
        <div className="flex items-center gap-4 font-mono">
          <button
            onClick={onOpenDashboard}
            className="text-amber-300 hover:text-white transition-colors font-medium hover:underline"
          >
            Admin Page
          </button>
          <span className="text-slate-500">|</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Surveillance System: 99.98% Uptime</span>
          </span>
        </div>

      </div>
    </footer>
  )
}

