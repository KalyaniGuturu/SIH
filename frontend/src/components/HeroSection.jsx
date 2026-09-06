import React, { useState, useEffect } from 'react'
import { TrendingUp, Database, MapPin, ArrowRight, Clock, Calendar, CheckCircle2, Activity, Info, BarChart3 } from 'lucide-react'

export default function HeroSection({ onNavigate }) {
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [lastUpdatedTime, setLastUpdatedTime] = useState('04 Sep 2026, 03:30 PM IST')

  useEffect(() => {
    // Keep updated date and time in layout
    const now = new Date()
    const formatted = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }) + ', ' + now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    }) + ' IST'
    setLastUpdatedTime(formatted)
  }, [])

  // 3 Complementary Key Indicator Cards (Placed below the 50/50 hero index block)
  const stats = [
    {
      label: 'Daily Fares Collected',
      value: '12,450',
      subtext: 'Processed in last 24 hrs',
      indicator: '99.8% Integrity',
      icon: Database,
      accent: 'text-cyan-400',
      border: 'border-cyan-500/20 hover:border-cyan-500/50',
      badge: 'Active Ingestion',
      badgeColor: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
    },
    {
      label: 'Monitored Corridors',
      value: '142',
      subtext: 'Metro + UDAN regional',
      indicator: '28 States & UTs',
      icon: MapPin,
      accent: 'text-emerald-400',
      border: 'border-emerald-500/20 hover:border-emerald-500/50',
      badge: 'Pan-India Coverage',
      badgeColor: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
    },
    {
      label: 'Inflation Rate',
      value: '5.82%',
      subtext: 'Annualized Transport CPI',
      indicator: 'MoSPI Target: 4.0% ± 2%',
      icon: TrendingUp,
      accent: 'text-rose-400',
      border: 'border-rose-500/20 hover:border-rose-500/50',
      badge: 'Headline Metric',
      badgeColor: 'bg-rose-950/60 text-rose-300 border-rose-500/30'
    },
  ]

  // Trend Graph Data for National Airfare Index (Past 30 Days)
  const indexGraphData = [
    { day: '06 Aug', index: 108.5 },
    { day: '10 Aug', index: 110.2 },
    { day: '14 Aug', index: 112.8 },
    { day: '18 Aug', index: 111.4 },
    { day: '22 Aug', index: 115.6 },
    { day: '26 Aug', index: 114.9 },
    { day: '30 Aug', index: 119.2 },
    { day: '02 Sep', index: 117.8 },
    { day: '04 Sep', index: 118.4 },
  ]

  const svgWidth = 520
  const svgHeight = 220
  const padX = 45
  const padY = 30
  const minVal = 100
  const maxVal = 125

  const getY = (val) => svgHeight - padY - ((val - minVal) / (maxVal - minVal)) * (svgHeight - padY * 2)
  const getX = (idx) => padX + (idx / (indexGraphData.length - 1)) * (svgWidth - padX * 2)

  const pointsStr = indexGraphData.map((d, i) => `${getX(i)},${getY(d.index)}`).join(' ')
  const areaPoints = `${getX(0)},${getY(indexGraphData[0].index)} ${pointsStr} ${getX(indexGraphData.length - 1)},${svgHeight - padY} ${getX(0)},${svgHeight - padY}`
  const baseLineY = getY(100)

  return (
    <section id="overview" className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-600/10 via-amber-500/10 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/5 blur-[120px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Heading */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-[1.15]">
            Dynamic Airfare Price Index for{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-cyan-300 bg-clip-text text-transparent">
              National Inflation Tracking
            </span>
          </h1>

          {/* Subtitle with high institutional clarity */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            Automating high-frequency airfare surveillance across{' '}
            <strong className="text-white font-semibold">IndiGo</strong>,{' '}
            <strong className="text-white font-semibold">Air India</strong>,{' '}
            <strong className="text-white font-semibold">MakeMyTrip</strong>, and{' '}
            <strong className="text-white font-semibold">EaseMyTrip</strong>.
            Replacing static quarterly surveys with empirical, fee-normalized price series for official MoSPI transport basket integration.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('corridors')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-500/25 active:scale-95 transition-all"
            >
              <span>Explore Live Airfare Index</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('pipeline-health')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/50 shadow-md backdrop-blur-md transition-all group"
            >
              <span className="group-hover:text-cyan-300 transition-colors">View Pipeline Health</span>
              <span className="text-slate-500 group-hover:text-cyan-400">→</span>
            </button>
          </div>
        </div>

        {/* 50/50 Screen Layout: National Airfare Index (Half Screen) + Index Graph (Next to it) */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Left: National Airfare Index Hero Showcase (Half Container) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 border border-amber-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient corner glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />

            <div>
              {/* Header tags */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 uppercase tracking-wide">
                  Official MoSPI CPI Benchmark
                </span>
                
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Active Empirical Stream</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white mt-5">
                National Airfare Price Index
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
                Axiomatic unweighted geometric composite across 142 Indian flight corridors
              </p>

              {/* Giant Index Number Display */}
              <div className="mt-6 flex flex-wrap items-baseline gap-4">
                <span className="text-6xl sm:text-7xl font-black font-mono text-white tracking-tight">
                  118.4
                </span>
                
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>+18.4% vs Base</span>
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    Base Benchmark: <strong className="text-slate-200">2024 = 100.0</strong>
                  </div>
                </div>
              </div>

              {/* Quick Metrics Sub-grid */}
              <div className="mt-6 grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 text-[11px] block">MONTH-OVER-MONTH</span>
                  <span className="text-sm font-bold text-amber-400 mt-0.5 block">+1.8% MoM Inflation</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-500 text-[11px] block">CONFIDENCE INTERVAL</span>
                  <span className="text-sm font-bold text-cyan-300 mt-0.5 block">117.85 &ndash; 118.99</span>
                </div>
              </div>
            </div>

            {/* Prominent Recently Updated Date and Time in Layout */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-400">Recently Updated:</span>
                <span className="font-bold text-white tracking-wide">{lastUpdatedTime}</span>
              </div>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Scheduled 6h sync cycle</span>
              </span>
            </div>
          </div>

          {/* Right: National Airfare Index Graph (Next to it, Half Container) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-heading flex items-center gap-2">
                    <span>National Airfare Index Trajectory</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                      30-Day Trend
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Live surveillance index vs. statutory 100.0 baseline
                  </p>
                </div>

                {/* Graph Legend */}
                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-cyan-400"></span>
                    <span className="text-cyan-300 text-[11px]">Index (118.4)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-amber-500 border-dashed"></span>
                    <span className="text-amber-400 text-[11px]">Base (100.0)</span>
                  </div>
                </div>
              </div>

              {/* SVG Curve Display */}
              <div className="relative mt-4 w-full select-none overflow-x-auto">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[420px]">
                  <defs>
                    <linearGradient id="indexGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[100, 110, 120].map((val) => {
                    const y = getY(val)
                    return (
                      <g key={val}>
                        <line
                          x1={padX}
                          y1={y}
                          x2={svgWidth - padX}
                          y2={y}
                          stroke="#1e293b"
                          strokeDasharray={val === 100 ? '4 4' : 'none'}
                          strokeWidth={val === 100 ? 1.5 : 1}
                        />
                        <text
                          x={padX - 8}
                          y={y + 4}
                          fill={val === 100 ? '#f59e0b' : '#64748b'}
                          fontSize="10"
                          fontFamily="monospace"
                          textAnchor="end"
                        >
                          {val}
                        </text>
                      </g>
                    )
                  })}

                  {/* Gradient area fill under curve */}
                  <polygon points={areaPoints} fill="url(#indexGradient)" />

                  {/* Base Benchmark Reference Line (100.0) */}
                  <line
                    x1={padX}
                    y1={baseLineY}
                    x2={svgWidth - padX}
                    y2={baseLineY}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />

                  {/* Dynamic Index Polyline */}
                  <polyline
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsStr}
                  />

                  {/* Data Points with Hover Interaction */}
                  {indexGraphData.map((d, i) => {
                    const cx = getX(i)
                    const cy = getY(d.index)
                    const isHovered = hoveredPoint === i

                    return (
                      <g
                        key={i}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(i)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      >
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 6 : 4}
                          fill={isHovered ? '#f59e0b' : '#22d3ee'}
                          stroke="#020617"
                          strokeWidth="2"
                        />
                        <text
                          x={cx}
                          y={svgHeight - 10}
                          fill="#64748b"
                          fontSize="9"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {d.day}
                        </text>
                      </g>
                    )
                  })}
                </svg>

                {/* Hover Tooltip Overlay */}
                {hoveredPoint !== null && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-cyan-400 px-3 py-1.5 rounded-lg shadow-xl text-xs font-mono pointer-events-none flex items-center gap-3 backdrop-blur-md">
                    <span className="text-slate-400">{indexGraphData[hoveredPoint].day}:</span>
                    <span className="text-cyan-300 font-bold">{indexGraphData[hoveredPoint].index}</span>
                    <span className="text-emerald-400 font-bold">
                      +{(indexGraphData[hoveredPoint].index - 100).toFixed(1)}% vs Base
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Graph Footer Stats */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
              <div>
                <span>30-Day Range: </span>
                <span className="text-slate-200 font-bold">108.5 &rarr; 119.5</span>
              </div>
              <div className="text-amber-400 font-bold">
                Current: 118.4 (+18.4%)
              </div>
            </div>
          </div>

        </div>

        {/* 3 Complementary Indicator Cards Grid (Daily Fares, Corridors, Inflation Rate) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className={`relative p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border ${stat.border} shadow-xl backdrop-blur-xl transition-all duration-300 group hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${stat.badgeColor}`}>
                    {stat.badge}
                  </span>
                  <div className={`p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 ${stat.accent} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs font-medium text-slate-400 tracking-wide uppercase">
                    {stat.label}
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white mt-1 tracking-tight">
                    {stat.value}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{stat.subtext}</span>
                  <span className="text-slate-500 font-mono text-[11px]">{stat.indicator}</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
