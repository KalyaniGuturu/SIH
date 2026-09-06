import React, { useState } from 'react'
import { Plane, Activity, Table, Terminal, Menu, X, ArrowRight } from 'lucide-react'

export default function Navbar({ currentView, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'overview', name: 'Overview' },
    { id: 'pipeline-health', name: 'Pipeline Health' },
    { id: 'corridors', name: 'Live Corridors' },
  ]

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#071b33] border-b border-[#163863] transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Seal */}
          <button
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0e2f59] via-[#123b6d] to-[#0a2342] border border-[#23538c] shadow-md group-hover:border-amber-400 transition-all">
              <Plane className="w-5 h-5 text-amber-300 transform -rotate-45 group-hover:scale-110 transition-transform" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[8px] font-black text-slate-950 shadow-xs">
                IN
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold font-heading tracking-tight text-white group-hover:text-amber-200 transition-colors">
                  National <span className="text-amber-300">Airfare Index</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#051427] text-amber-300 border border-[#163863]">
                  Official System
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-medium tracking-wide">
                National Airfare Index System
              </span>
            </div>
          </button>

          {/* Desktop Navigation Tabs (Direct View Switching, Zero Scrolling) */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#05152a] p-1.5 rounded-xl border border-[#143660]">
            {navItems.map((item) => {
              const isActive = currentView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#153f72] text-amber-300 font-bold border border-[#29609f] shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-[#0e2f59]'
                  }`}
                >
                  {item.name}
                </button>
              )
            })}
          </div>

          {/* Action Navigation Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onNavigate('tracker')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentView === 'radar' || currentView === 'tracker'
                  ? 'bg-[#174886] text-white shadow-md border border-[#3471ba]'
                  : 'text-slate-100 bg-[#0c284a] hover:bg-[#123969] border border-[#1a4477] hover:border-amber-300/60'
              }`}
            >
              <Plane className="w-3.5 h-3.5 transform -rotate-45 text-amber-300" />
              <span>Route Tracker</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
                currentView === 'dashboard'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-bold ring-2 ring-amber-300'
                  : 'text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Admin Page</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300"
            >
              Admin Page
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-[#0e2f59] focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#071b33] border-b border-[#163863] px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMobileMenuOpen(false)
                onNavigate(item.id)
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                currentView === item.id
                  ? 'bg-[#153f72] text-amber-300 font-bold'
                  : 'text-slate-200 hover:text-white hover:bg-[#0e2f59]'
              }`}
            >
              {item.name}
            </button>
          ))}

          <button
            onClick={() => {
              setMobileMenuOpen(false)
              onNavigate('tracker')
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              currentView === 'radar' || currentView === 'tracker'
                ? 'bg-[#153f72] text-amber-300 font-bold'
                : 'text-slate-100 hover:bg-[#0e2f59]'
            }`}
          >
            Route Tracker
          </button>

          <div className="pt-2 border-t border-[#163863]">
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onNavigate('dashboard')
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-950 bg-amber-400"
            >
              <Terminal className="w-4 h-4" />
              Admin Page
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
