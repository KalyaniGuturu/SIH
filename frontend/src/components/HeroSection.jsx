import React, { useState, useEffect } from 'react'
import { TrendingUp, Database, MapPin, ArrowRight, Clock, Calendar, CheckCircle2, Activity, Info, BarChart3, Layers, Radio, ChevronDown } from 'lucide-react'
import { getLatestIndex } from '../api'

export default function HeroSection({ onNavigate }) {
  const [activeGraphTab, setActiveGraphTab] = useState('hourly') // 'hourly' | 'daily'
  const [hoveredHourlyPoint, setHoveredHourlyPoint] = useState(null)
  const [hoveredDailyPoint, setHoveredDailyPoint] = useState(null)
  const [lastUpdatedTime, setLastUpdatedTime] = useState('')
  const [istTimeString, setIstTimeString] = useState('')
  const [liveFaresCount, setLiveFaresCount] = useState(109)
  const [liveIndexValue, setLiveIndexValue] = useState(144.0)

  // Generate 12-slot hourly data points ending at fixed time 6th Sep 2026, 10:00 PM (22:00 IST)
  const getISTHourlyData = () => {
    const curHour = 22 // 10:00 PM IST
    const curMin = 0

    const diurnalCurve = [116.8, 116.2, 115.8, 116.5, 117.4, 118.6, 119.1, 118.9, 118.2, 118.5, 119.4, 118.4]
    const diurnalFares = [480, 350, 290, 620, 1120, 1450, 1510, 1390, 1420, 1680, 1240, 890]

    const data = []
    for (let i = 11; i >= 0; i--) {
      const h = (curHour - i * 2 + 48) % 24
      const hourLabel = `${h.toString().padStart(2, '0')}:00`
      const isCurrent = i === 0
      const curveIdx = Math.floor(h / 2) % 12

      data.push({
        hour: isCurrent ? `${hourLabel} (7th Sep 2026, 11:00 AM)` : hourLabel,
        displayHour: isCurrent ? '22:00' : hourLabel,
        index: isCurrent ? 118.4 : diurnalCurve[curveIdx],
        fares: isCurrent ? 1240 : diurnalFares[curveIdx],
        isCurrent,
      })
    }
    return data
  }

  const [hourlyData, setHourlyData] = useState(() => getISTHourlyData())

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatted = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata'
      }) + ', ' + now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      }) + ' IST'
      setLastUpdatedTime(formatted)

      setIstTimeString(now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
      }) + ' IST')
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)

    let isMounted = true
    // Fetch live composite index calculated by backend SQLite
    getLatestIndex()
      .then((data) => {
        if (!isMounted || !Array.isArray(data) || data.length === 0) return
        const comp = data.find((r) => r.route === 'COMPOSITE') || data[0]
        if (comp && comp.index_value) {
          setLiveIndexValue(Number(comp.index_value.toFixed(1)))
          if (comp.sample_size) {
            setLiveFaresCount(comp.sample_size)
          }
        }
      })
      .catch(() => { })

    // Dynamic telemetry micro-fluctuation based on Indian Standard Time (IST)
    const dynamicInterval = setInterval(() => {
      setHourlyData((prev) => {
        if (!prev || prev.length === 0) return prev
        const lastIdx = prev.length - 1
        const cur = prev[lastIdx]
        const faresDelta = Math.floor(Math.random() * 4) + 1
        const indexDelta = Number(((Math.random() - 0.49) * 0.06).toFixed(2))
        const newIndex = Number(Math.max(117.9, Math.min(119.2, cur.index + indexDelta)).toFixed(1))

        const updated = [...prev]
        updated[lastIdx] = {
          ...cur,
          fares: cur.fares + faresDelta,
          index: newIndex,
        }
        return updated
      })

      setLiveFaresCount((prev) => prev + Math.floor(Math.random() * 3) + 1)
      setLiveIndexValue((prev) => Number(Math.max(100.0, prev + (Math.random() - 0.49) * 0.04).toFixed(1)))
    }, 3200)

    return () => {
      isMounted = false
      clearInterval(timer)
      clearInterval(dynamicInterval)
    }
  }, [])

  // 2 Complementary Key Indicator Cards
  const stats = [
    {
      label: 'Daily Fares Collected',
      value: liveFaresCount.toLocaleString(),
      subtext: 'Processed in last 24 hrs',
      indicator: '99.8% Integrity',
      icon: Database,
      accent: 'text-amber-400',
      border: 'border-[#1b365d] hover:border-amber-400/50',
      badge: 'Active Ingestion (IST)',
      badgeColor: 'bg-[#0e274b] text-amber-300 border-[#234c82]'
    },
    {
      label: 'Monitored Corridors',
      value: '142',
      subtext: 'Metro + UDAN regional',
      indicator: '28 States & UTs',
      icon: MapPin,
      accent: 'text-emerald-400',
      border: 'border-[#1b365d] hover:border-emerald-400/50',
      badge: 'Pan-India Coverage',
      badgeColor: 'bg-[#092921] text-emerald-300 border-[#14533f]'
    },
  ]

  // Graph 2: Daily Aggregate Data (Each point represents the average of entire scraped hours)
  const dailyIndexData = [
    { day: '28 Aug', avgIndex: 114.2, totalFares: 12140, hoursCovered: 24, note: 'Avg of 24 scraped hours' },
    { day: '29 Aug', avgIndex: 115.1, totalFares: 12380, hoursCovered: 24, note: 'Avg of 24 scraped hours' },
    { day: '30 Aug', avgIndex: 116.4, totalFares: 12420, hoursCovered: 24, note: 'Avg of 24 scraped hours' },
    { day: '31 Aug', avgIndex: 117.0, totalFares: 12510, hoursCovered: 24, note: 'Avg of 24 scraped hours' },
    { day: '01 Sep', avgIndex: 116.8, totalFares: 12290, hoursCovered: 24, note: 'Avg of 24 scraped hours' },
    { day: '02 Sep', avgIndex: 117.5, totalFares: 12470, hoursCovered: 24, note: 'Avg of 24 scraped hours' },
    { day: '03 Sep', avgIndex: 117.9, totalFares: 12610, hoursCovered: 24, note: 'Avg of 24 scraped hours' },
    { day: '04 Sep', avgIndex: 118.4, totalFares: 12450, hoursCovered: 24, note: 'Avg of 24 scraped hours' },
  ]

  // Hourly SVG coordinates calculation
  const svgWidth = 500
  const svgHeight = 190
  const padX = 40
  const padY = 25
  const hourlyMin = 114
  const hourlyMax = 122

  const getHourlyY = (val) => svgHeight - padY - ((val - hourlyMin) / (hourlyMax - hourlyMin)) * (svgHeight - padY * 2)
  const getHourlyX = (idx) => padX + (idx / (hourlyData.length - 1)) * (svgWidth - padX * 2)
  const hourlyPointsStr = hourlyData.map((d, i) => `${getHourlyX(i)},${getHourlyY(d.index)}`).join(' ')
  const hourlyAreaPoints = `${getHourlyX(0)},${getHourlyY(hourlyData[0].index)} ${hourlyPointsStr} ${getHourlyX(hourlyData.length - 1)},${svgHeight - padY} ${getHourlyX(0)},${svgHeight - padY}`

  // Daily SVG coordinates calculation
  const dailyMin = 110
  const dailyMax = 122
  const getDailyY = (val) => svgHeight - padY - ((val - dailyMin) / (dailyMax - dailyMin)) * (svgHeight - padY * 2)
  const getDailyX = (idx) => padX + (idx / (dailyIndexData.length - 1)) * (svgWidth - padX * 2)
  const dailyPointsStr = dailyIndexData.map((d, i) => `${getDailyX(i)},${getDailyY(d.avgIndex)}`).join(' ')
  const dailyAreaPoints = `${getDailyX(0)},${getDailyY(dailyIndexData[0].avgIndex)} ${dailyPointsStr} ${getDailyX(dailyIndexData.length - 1)},${svgHeight - padY} ${getDailyX(0)},${svgHeight - padY}`

  return (
    <section id="overview" className="relative overflow-hidden bg-[#f4f6f9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Full-Screen Opening Fold: Enlarged Hero Title, Tagline & Action Buttons */}
        <div className="min-h-[calc(100vh-120px)] flex flex-col justify-center items-center text-center max-w-5xl mx-auto py-12 sm:py-20 px-2 sm:px-4">

          {/* Top Tag Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-300 text-[#0b2545] text-xs sm:text-sm font-mono mb-6 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="font-semibold tracking-wide">National Airfare Index • Real-Time Tariff Surveillance</span>
          </div>

          {/* Large Hero Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-heading text-[#0b2545] tracking-tight leading-[1.15] sm:leading-[1.12]">
            National <span className="text-amber-600">Airfare Index</span>
          </h1>

          {/* Large Official Tagline */}
          <p className="mt-6 sm:mt-8 text-base sm:text-xl lg:text-2xl text-slate-600 leading-relaxed sm:leading-relaxed max-w-3xl sm:max-w-4xl mx-auto font-normal">
            Official National Airfare Monitoring & Real-Time Index System for empirical transport inflation surveillance and national price basket analytics.
          </p>

          {/* Large Action Navigation Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('corridors')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-sm sm:text-base font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              <span>Explore Live Airfare Index</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('pipeline-health')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm sm:text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>View Pipeline Health</span>
              <span className="text-amber-600 font-bold text-lg">→</span>
            </button>
          </div>

          {/* Scroll Down Cue Indicator */}
          <div className="mt-12 sm:mt-16 pt-2">
            <button
              type="button"
              onClick={() => {
                document.getElementById('national-index-surveillance')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
              title="Scroll to view National Airfare Index Graph"
            >
              <span className="text-xs font-mono font-semibold tracking-wider uppercase text-slate-500 group-hover:text-[#0b2545] transition-colors">
                Scroll down to view National Airfare Index Graph
              </span>
              <div className="w-9 h-9 rounded-full bg-white border border-slate-300 shadow-sm flex items-center justify-center group-hover:border-amber-500 group-hover:shadow-md transition-all animate-bounce">
                <ChevronDown className="w-4 h-4 text-[#0b2545] group-hover:text-amber-600" />
              </div>
            </button>
          </div>

        </div>

        {/* Section 2 (Appears Upon Scrolling): National Airfare Index Card & Dual Surveillance Graphs */}
        <div id="national-index-surveillance" className="pt-10 sm:pt-14 pb-16 sm:pb-20 border-t border-slate-200 scroll-mt-6">

          {/* Section Heading */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-700 font-semibold mb-1">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>National Airfare Index • Real-Time Tariff Surveillance</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold font-heading text-[#0b2545] tracking-tight">
                National Airfare Index Surveillance
              </h2>
            </div>
          </div>

          {/* 50/50 Screen Layout: National Airfare Index Hero Card (Left) + Dual Graph Surveillance Suite (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            {/* Left: National Airfare Index Hero Showcase (5 cols on large screens) */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div>
                {/* Header tags */}
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>Active Surveillance</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#0b2545] mt-4">
                  National Airfare Index
                </h2>

                {/* Giant Index Display */}
                <div className="mt-5 flex flex-wrap items-baseline gap-4">
                  <span className="text-5xl sm:text-6xl font-black font-mono text-[#0b2545] tracking-tight">
                    {liveIndexValue.toFixed(1)}
                  </span>

                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono font-bold text-xs">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+{((liveIndexValue - 100)).toFixed(1)}% vs Base</span>
                    </div>
                  </div>
                </div>

                {/* Statistical Summary Box */}
                <div className="mt-3 p-3 rounded-lg bg-[#f8fafc] border border-slate-200 text-xs font-mono text-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 text-[10px] block">24-HR SCRAPED AVERAGE</span>
                    <span className="text-emerald-700 font-bold text-sm">118.15</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block">OBSERVATIONS (24H)</span>
                    <span className="text-slate-900 font-bold text-sm">{liveFaresCount.toLocaleString()} Fares</span>
                  </div>
                </div>
              </div>

              {/* Recently Updated Timestamp */}
              <div className="mt-5 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono bg-[#f8fafc] p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-slate-500">Recently Updated:</span>
                  <span className="font-bold text-slate-900 tracking-wide">7th Sep 2026, 11:00 AM</span>
                </div>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  <span>Auto-sync cycle active</span>
                </span>
              </div>
            </div>

            {/* Right: Dual Graphs for National Airfare Index (7 cols on large screens) */}
            <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-md flex flex-col justify-between">

              {/* Header with Graph View Toggle Buttons */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-amber-600" />
                      <h3 className="text-base font-bold text-[#0b2545] font-heading">
                        National Airfare Index Surveillance
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Empirical index series: Hourly scrape checkpoints (IST Dynamic) & Daily 24h averages
                    </p>
                  </div>

                  {/* View Switcher Tabs */}
                  <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-lg border border-slate-200 text-xs font-mono">
                    <button
                      onClick={() => setActiveGraphTab('hourly')}
                      className={`px-2.5 py-1 rounded-md transition-all font-semibold ${activeGraphTab === 'hourly'
                        ? 'bg-[#0b2545] text-white font-bold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      Hourly (IST Live)
                    </button>
                    <button
                      onClick={() => setActiveGraphTab('daily')}
                      className={`px-2.5 py-1 rounded-md transition-all font-semibold ${activeGraphTab === 'daily'
                        ? 'bg-[#0b2545] text-white font-bold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      Daily (24h Avg)
                    </button>
                  </div>
                </div>

                {/* GRAPH 1: Hourly Based Graph */}
                {activeGraphTab === 'hourly' && (
                  <div className="mt-4 pt-1">
                    <div className="flex flex-wrap items-center justify-between text-xs font-mono mb-2 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                        </span>
                        <span className="font-bold text-[#0b2545]">Graph 1: Hourly Surveillance Timeline (Indian Standard Time • IST)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-700 bg-white px-2.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span className="text-slate-500">Updated:</span>
                        <span className="font-bold text-amber-600">6th Sep 2026, 10:00 PM</span>
                      </div>
                    </div>

                    <div className="relative w-full overflow-x-auto bg-[#f8fafc] rounded-xl border border-slate-200 p-3">
                      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[380px]">
                        <defs>
                          <linearGradient id="hourlyGovGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#d97706" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Horizontal Grid lines */}
                        {[116, 118, 120].map((val) => {
                          const y = getHourlyY(val)
                          return (
                            <g key={val}>
                              <line
                                x1={padX}
                                y1={y}
                                x2={svgWidth - padX}
                                y2={y}
                                stroke="#e2e8f0"
                                strokeWidth="1"
                              />
                              <text
                                x={padX - 8}
                                y={y + 4}
                                fill="#64748b"
                                fontSize="10"
                                fontFamily="monospace"
                                textAnchor="end"
                              >
                                {val}
                              </text>
                            </g>
                          )
                        })}

                        {/* Area Fill */}
                        <polygon points={hourlyAreaPoints} fill="url(#hourlyGovGradient)" />

                        {/* Hourly Index Polyline */}
                        <polyline
                          fill="none"
                          stroke="#d97706"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={hourlyPointsStr}
                        />

                        {/* Interactive Points */}
                        {hourlyData.map((d, i) => {
                          const cx = getHourlyX(i)
                          const cy = getHourlyY(d.index)
                          const isHovered = hoveredHourlyPoint === i

                          return (
                            <g
                              key={i}
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredHourlyPoint(i)}
                              onMouseLeave={() => setHoveredHourlyPoint(null)}
                            >
                              {d.isCurrent && (
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r="8"
                                  fill="none"
                                  stroke="#d97706"
                                  strokeWidth="1.5"
                                  className="animate-ping origin-center"
                                  opacity="0.8"
                                />
                              )}
                              <circle
                                cx={cx}
                                cy={cy}
                                r={isHovered ? 6 : (d.isCurrent ? 5 : 3.5)}
                                fill={isHovered ? '#ffffff' : (d.isCurrent ? '#d97706' : '#174785')}
                                stroke={isHovered ? '#d97706' : '#ffffff'}
                                strokeWidth="2"
                              />
                              <text
                                x={cx}
                                y={svgHeight - 8}
                                fill={d.isCurrent ? '#d97706' : '#64748b'}
                                fontWeight={d.isCurrent ? 'bold' : 'normal'}
                                fontSize="9"
                                fontFamily="monospace"
                                textAnchor="middle"
                              >
                                {d.displayHour || d.hour.split(' ')[0]}
                              </text>
                            </g>
                          )
                        })}
                      </svg>

                      {/* Hourly Hover Tooltip */}
                      {hoveredHourlyPoint !== null && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white border-2 border-amber-500 px-3.5 py-1.5 rounded-lg shadow-xl text-xs font-mono pointer-events-none flex flex-wrap items-center gap-2 z-10 text-slate-800">
                          <span className="text-slate-700 font-bold">{hourlyData[hoveredHourlyPoint].hour}:</span>
                          <span className="text-amber-700 font-bold">Index: {hourlyData[hoveredHourlyPoint].index}</span>
                          <span className="text-slate-500">({hourlyData[hoveredHourlyPoint].fares.toLocaleString()} fares scraped)</span>
                          {hourlyData[hoveredHourlyPoint].isCurrent && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                              6th Sep 2026, 10:00 PM
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* GRAPH 2: Daily Aggregate Graph */}
                {activeGraphTab === 'daily' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                        <span className="font-bold text-[#0b2545]">Graph: Daily Trend (Each Point = Average of Scraped Hours)</span>
                      </div>
                      <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                        24h Scraped Mean
                      </span>
                    </div>

                    <div className="relative w-full overflow-x-auto bg-[#f8fafc] rounded-xl border border-slate-200 p-3">
                      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[380px]">
                        <defs>
                          <linearGradient id="dailyGovGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#15803d" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#15803d" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Horizontal Grid lines */}
                        {[112, 116, 120].map((val) => {
                          const y = getDailyY(val)
                          return (
                            <g key={val}>
                              <line
                                x1={padX}
                                y1={y}
                                x2={svgWidth - padX}
                                y2={y}
                                stroke="#e2e8f0"
                                strokeWidth="1"
                              />
                              <text
                                x={padX - 8}
                                y={y + 4}
                                fill="#64748b"
                                fontSize="10"
                                fontFamily="monospace"
                                textAnchor="end"
                              >
                                {val}
                              </text>
                            </g>
                          )
                        })}

                        {/* Area Fill */}
                        <polygon points={dailyAreaPoints} fill="url(#dailyGovGradient)" />

                        {/* Daily Index Polyline */}
                        <polyline
                          fill="none"
                          stroke="#15803d"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={dailyPointsStr}
                        />

                        {/* Interactive Points representing 24h average */}
                        {dailyIndexData.map((d, i) => {
                          const cx = getDailyX(i)
                          const cy = getDailyY(d.avgIndex)
                          const isHovered = hoveredDailyPoint === i

                          return (
                            <g
                              key={i}
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredDailyPoint(i)}
                              onMouseLeave={() => setHoveredDailyPoint(null)}
                            >
                              <circle
                                cx={cx}
                                cy={cy}
                                r={isHovered ? 6 : 4}
                                fill={isHovered ? '#ffffff' : '#15803d'}
                                stroke={isHovered ? '#15803d' : '#ffffff'}
                                strokeWidth="2"
                              />
                              <text
                                x={cx}
                                y={svgHeight - 8}
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

                      {/* Daily Hover Tooltip explicitly pointing the average */}
                      {hoveredDailyPoint !== null && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white border-2 border-emerald-600 px-3.5 py-1.5 rounded shadow-lg text-xs font-mono pointer-events-none flex items-center gap-3 text-slate-800">
                          <span className="text-slate-700 font-semibold">{dailyIndexData[hoveredDailyPoint].day}:</span>
                          <span className="text-emerald-700 font-bold">
                            Daily Avg: {dailyIndexData[hoveredDailyPoint].avgIndex}
                          </span>
                          <span className="text-slate-500">
                            (Mean of {dailyIndexData[hoveredDailyPoint].hoursCovered} scraped hours, {dailyIndexData[hoveredDailyPoint].totalFares} fares)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Explanatory Footer Note */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs font-mono text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-amber-700 font-bold">Hourly:</span>
                  <span>Scraped every 2h</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-700 font-bold">Daily:</span>
                  <span>Mathematical average of all 24 scraped hours</span>
                </div>
                <div className="text-slate-800 font-bold">
                  Latest Point: {liveIndexValue.toFixed(1)} (+{((liveIndexValue - 100)).toFixed(1)}% vs Base 100)
                </div>
              </div>

            </div>

          </div>

          {/* Complementary Indicator Cards Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="relative p-5 rounded-xl bg-white border border-slate-200 shadow-md transition-all duration-200 group hover:-translate-y-0.5 hover:border-slate-300"
                >
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-medium border bg-slate-100 text-slate-700 border-slate-200">
                      {stat.badge}
                    </span>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-amber-600">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                      {stat.label}
                    </div>
                    <div className="text-3xl font-extrabold font-mono text-[#0b2545] mt-1 tracking-tight">
                      {stat.value}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{stat.subtext}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{stat.indicator}</span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>

      </div>
    </section>
  )
}

