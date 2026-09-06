import React, { useState, useEffect, useId } from 'react'
import {
  TrendingUp,
  Database,
  MapPin,
  Clock,
  Download,
  Filter,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Activity,
  ArrowLeft,
  ChevronRight,
  Plane,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  Calendar,
  Layers,
  Pause,
  Play
} from 'lucide-react'

export default function Dashboard({ onBackToLanding, onGoToRouteAnalytics }) {
  const [method, setMethod] = useState('jevons') // 'jevons' | 'laspeyres'
  const [bookingWindow, setBookingWindow] = useState('7d') // '0-3d' | '7d' | '15d' | '30d'
  const [hoveredDataPoint, setHoveredDataPoint] = useState(null)
  const [isTerminalStreaming, setIsTerminalStreaming] = useState(true)
  const [logs, setLogs] = useState([
    { id: 1, time: '15:28:02', level: 'INFO', msg: 'Scraped IndiGo DEL-BOM: ₹5,700 - OK' },
    { id: 2, time: '15:28:04', level: 'FEE', msg: 'Stripped UDF (₹450) & GST (₹285) on BOM-BLR' },
    { id: 3, time: '15:28:07', level: 'PROXY', msg: 'Residential proxy 103.21.58.12 rotated cleanly' },
    { id: 4, time: '15:28:09', level: 'INFO', msg: 'Scraped Air India BLR-DEL: ₹6,450 - OK' },
    { id: 5, time: '15:28:12', level: 'MATH', msg: 'Jevons elementary sub-aggregate updated: 118.42' },
    { id: 6, time: '15:28:15', level: 'FEED', msg: 'MoSPI NAS batch transmission acknowledged #8914' },
  ])

  // Periodic log streamer simulation
  useEffect(() => {
    if (!isTerminalStreaming) return

    const routes = ['DEL-BOM', 'BLR-DEL', 'CCU-DEL', 'BOM-GOI', 'MAA-CCU', 'HYD-BOM']
    const carriers = ['IndiGo', 'Air India', 'MakeMyTrip', 'EaseMyTrip']
    const levels = ['INFO', 'FEE', 'PROXY', 'MATH', 'FEED']

    const interval = setInterval(() => {
      const route = routes[Math.floor(Math.random() * routes.length)]
      const carrier = carriers[Math.floor(Math.random() * carriers.length)]
      const fare = Math.floor(Math.random() * 3000 + 4000)
      const now = new Date()
      const timeStr = now.toTimeString().split(' ')[0]

      const sampleMsgs = [
        `Scraped ${carrier} ${route}: ₹${fare.toLocaleString()} - OK`,
        `Decomposed fuel surcharge YQ (₹420) for ${route}`,
        `Akamai bot challenge bypassed via session proxy cluster`,
        `Sub-aggregate Jevons ratio normalized for ${route} (P_t/P_0: ${(fare / 4200).toFixed(2)})`,
        `MoSPI telemetry heartbeat: 14/14 scraper workers verified`,
      ]

      const newEntry = {
        id: Date.now(),
        time: timeStr,
        level: levels[Math.floor(Math.random() * levels.length)],
        msg: sampleMsgs[Math.floor(Math.random() * sampleMsgs.length)],
      }

      setLogs((prev) => [newEntry, ...prev.slice(0, 19)])
    }, 2800)

    return () => clearInterval(interval)
  }, [isTerminalStreaming])

  // Method-specific index calculation
  const currentKPIs = {
    index: method === 'jevons' ? '118.4' : '121.2',
    baseChange: method === 'jevons' ? '+18.4% Base' : '+21.2% Base',
    avgFare: method === 'jevons' ? '₹5,850' : '₹6,120',
    activeRoutes: '142',
    scrapedPoints: '12.4k/24h',
  }

  // 30-Day Time Series Data for Chart
  const timeSeriesData = [
    { day: 1, date: 'Aug 06', index: 109.2, baseline: 100 },
    { day: 3, date: 'Aug 08', index: 110.5, baseline: 100 },
    { day: 5, date: 'Aug 10', index: 112.1, baseline: 100 },
    { day: 8, date: 'Aug 13', index: 114.8, baseline: 100 },
    { day: 11, date: 'Aug 16', index: 113.2, baseline: 100 },
    { day: 14, date: 'Aug 19', index: 115.0, baseline: 100 },
    { day: 17, date: 'Aug 22', index: 118.6, baseline: 100 },
    { day: 20, date: 'Aug 25', index: 116.4, baseline: 100 },
    { day: 23, date: 'Aug 28', index: 117.8, baseline: 100 },
    { day: 26, date: 'Aug 31', index: 119.5, baseline: 100 },
    { day: 28, date: 'Sep 02', index: 117.9, baseline: 100 },
    { day: 30, date: 'Sep 04', index: 118.4, baseline: 100 },
  ]

  // Peak fare spikes across top corridors
  const corridorSpikes = [
    { corridor: 'DEL ✈️ BOM', peakFare: '₹8,420', spike: '+42%', base: '₹5,900', pct: 92, carrier: 'IndiGo' },
    { corridor: 'BOM ✈️ BLR', peakFare: '₹6,890', spike: '+28%', base: '₹5,380', pct: 75, carrier: 'Air India' },
    { corridor: 'CCU ✈️ DEL', peakFare: '₹7,250', spike: '+35%', base: '₹5,370', pct: 82, carrier: 'MakeMyTrip' },
    { corridor: 'HYD ✈️ DEL', peakFare: '₹5,980', spike: '+18%', base: '₹5,060', pct: 60, carrier: 'EaseMyTrip' },
    { corridor: 'DEL ✈️ GOI', peakFare: '₹6,400', spike: '+22%', base: '₹5,240', pct: 66, carrier: 'IndiGo' },
  ]

  // Live Scraper Activity Feed Table Data
  const [liveFeeds] = useState([
    {
      id: 'FEED-901',
      route: 'DEL ✈️ BOM',
      carrier: 'IndiGo (6E-5012)',
      window: '0–3 Days',
      extractedFare: '₹5,700',
      status: 'Validated',
      statusType: 'valid',
      timestamp: 'Just now',
    },
    {
      id: 'FEED-902',
      route: 'BOM ✈️ BLR',
      carrier: 'Air India (AI-639)',
      window: '7 Days',
      extractedFare: '₹4,950',
      status: 'Fee Cleaned',
      statusType: 'cleaned',
      timestamp: '1 min ago',
    },
    {
      id: 'FEED-903',
      route: 'CCU ✈️ DEL',
      carrier: 'MakeMyTrip API',
      window: '15 Days',
      extractedFare: '₹4,200',
      status: 'Normalizing',
      statusType: 'normalizing',
      timestamp: '2 mins ago',
    },
    {
      id: 'FEED-904',
      route: 'MAA ✈️ DEL',
      carrier: 'EaseMyTrip Feed',
      window: '30 Days',
      extractedFare: '₹3,890',
      status: 'Validated',
      statusType: 'valid',
      timestamp: '3 mins ago',
    },
    {
      id: 'FEED-905',
      route: 'HYD ✈️ BOM',
      carrier: 'IndiGo (6E-711)',
      window: '7 Days',
      extractedFare: '₹3,650',
      status: 'Fee Cleaned',
      statusType: 'cleaned',
      timestamp: '4 mins ago',
    },
    {
      id: 'FEED-906',
      route: 'DEL ✈️ GAU',
      carrier: 'Air India (AI-889)',
      window: '0–3 Days',
      extractedFare: '₹6,180',
      status: 'Validated',
      statusType: 'valid',
      timestamp: '5 mins ago',
    },
  ])

  // Export CSV Functionality
  const handleExportCSV = () => {
    const csvHeader = 'Corridor,Carrier,Booking_Window,Extracted_Fare,Validation_Status,Index_Method\n'
    const csvRows = liveFeeds
      .map(
        (f) =>
          `"${f.route}","${f.carrier}","${f.window}","${f.extractedFare}","${f.status}","${method.toUpperCase()}"`
      )
      .join('\n')

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `MoSPI_Airfare_CPI_Report_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // SVG dimensions for time-series chart
  const svgWidth = 650
  const svgHeight = 240
  const paddingX = 45
  const paddingY = 30
  const minVal = 95
  const maxVal = 125

  const getY = (val) => {
    return svgHeight - paddingY - ((val - minVal) / (maxVal - minVal)) * (svgHeight - paddingY * 2)
  }

  const getX = (index) => {
    return paddingX + (index / (timeSeriesData.length - 1)) * (svgWidth - paddingX * 2)
  }

  const pointsString = timeSeriesData.map((d, i) => `${getX(i)},${getY(d.index)}`).join(' ')
  const baselineY = getY(100)

  // Gradient fill area under curve
  const areaPoints = `${getX(0)},${getY(timeSeriesData[0].index)} ${pointsString} ${getX(
    timeSeriesData.length - 1
  )},${svgHeight - paddingY} ${getX(0)},${svgHeight - paddingY}`

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Ministry Bar */}
      <div className="bg-slate-950 border-b border-slate-800 text-xs py-2 px-4 sm:px-8 flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 rounded bg-slate-900 border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Portal</span>
          </button>
          <button
            onClick={onGoToRouteAnalytics}
            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium px-2 py-1 rounded bg-slate-900 border border-slate-800 transition-colors"
          >
            <Plane className="w-3.5 h-3.5 transform -rotate-45" />
            <span>Route Radar</span>
          </button>
          <span className="text-slate-600">|</span>
          <span className="font-semibold text-slate-300">
            MoSPI National Accounts Statistics (NAS) Division
          </span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline text-amber-400 font-mono">
            Problem SIH26056
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Surveillance Active</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono text-[11px]">
            Node: in-mospi-cluster-01
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-grow">
        
        {/* Section 1: Control Header Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Left: Title & Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-cyan-500/10 to-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight flex items-center gap-2">
                MoSPI Executive Airfare Analytics Console
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  v4.2-LIVE
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                National Airfare Price Index & Empirical Econometric Decomposition
              </p>
            </div>
          </div>

          {/* Controls: Formula Toggle + Advance Booking Window + Export Action */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            
            {/* Method Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => setMethod('jevons')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                  method === 'jevons'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Unweighted Geometric Mean (MoSPI Standard)"
              >
                Jevons (Geometric)
              </button>
              <button
                onClick={() => setMethod('laspeyres')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
                  method === 'laspeyres'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Passenger Volume Weighted Arithmetic Index"
              >
                Laspeyres (Weighted)
              </button>
            </div>

            {/* Advance Booking Selector */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <span className="px-2 text-slate-500 text-[11px] hidden sm:inline">Horizon:</span>
              {[
                { id: '0-3d', label: '0–3D' },
                { id: '7d', label: '7D' },
                { id: '15d', label: '15D' },
                { id: '30d', label: '30D' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setBookingWindow(tier.id)}
                  className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                    bookingWindow === tier.id
                      ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            {/* Export CSV Action Button */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-950" />
              <span>Export MoSPI CPI Report (.CSV)</span>
            </button>

          </div>
        </div>

        {/* Section 2: KPI Overview Grid (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Airfare Price Index */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-lg relative overflow-hidden group hover:border-amber-500/60 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Airfare Price Index ({method.toUpperCase()})
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                {currentKPIs.index}
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40">
                {currentKPIs.baseChange}
              </span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Base Benchmark: 2024 = 100</span>
              <span className="text-slate-300">MoM +1.8%</span>
            </div>
          </div>

          {/* Card 2: National Average Fare */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-lg relative overflow-hidden group hover:border-cyan-500/60 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                National Average Fare
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-cyan-300 tracking-tight">
                {currentKPIs.avgFare}
              </span>
              <span className="text-xs font-mono text-slate-400">Pure Base</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Excl. ₹890 UDF/GST</span>
              <span className="text-emerald-400 font-semibold">Normalized</span>
            </div>
          </div>

          {/* Card 3: Active Monitored Corridors */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Active Flight Corridors
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                {currentKPIs.activeRoutes}
              </span>
              <span className="text-xs font-mono text-emerald-400">Metro + UDAN</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between font-mono">
              <span>28 States & UTs</span>
              <span className="text-slate-300">100% Coverage</span>
            </div>
          </div>

          {/* Card 4: Scraped Data Points */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Scraped Data Points
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                {currentKPIs.scrapedPoints}
              </span>
              <span className="text-xs font-mono text-purple-400">Ingested</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between font-mono">
              <span>99.8% Parsed Integrity</span>
              <span className="text-emerald-400">0 IP Bans</span>
            </div>
          </div>

        </div>

        {/* Section 3: Main Visualization Grid (2 Columns: 2/3 and 1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left (2/3 width): Time Series Line Chart */}
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
                    <span>Dynamic Airfare Index (30 Days) vs. Official CPI Baseline</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      Time Series
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Empirical daily trajectory evaluated against MoSPI baseline of 100.0
                  </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-cyan-400"></span>
                    <span className="text-cyan-300 font-semibold">Dynamic Airfare Index</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-amber-500 border-dashed"></span>
                    <span className="text-amber-400 font-semibold">Official CPI Baseline (100.0)</span>
                  </div>
                </div>
              </div>

              {/* Responsive SVG Chart */}
              <div className="relative mt-4 w-full overflow-x-auto select-none">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-auto min-w-[500px]"
                >
                  <defs>
                    <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[100, 110, 120].map((val) => {
                    const y = getY(val)
                    return (
                      <g key={val}>
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={svgWidth - paddingX}
                          y2={y}
                          stroke="#1e293b"
                          strokeDasharray={val === 100 ? '4 4' : 'none'}
                          strokeWidth={val === 100 ? 1.5 : 1}
                        />
                        <text
                          x={paddingX - 8}
                          y={y + 4}
                          fill={val === 100 ? '#f59e0b' : '#64748b'}
                          fontSize="10"
                          fontFamily="monospace"
                          textAnchor="end"
                        >
                          {val}.0
                        </text>
                      </g>
                    )
                  })}

                  {/* Gradient area fill under curve */}
                  <polygon points={areaPoints} fill="url(#cyanGradient)" />

                  {/* Official Baseline Line (100.0) */}
                  <line
                    x1={paddingX}
                    y1={baselineY}
                    x2={svgWidth - paddingX}
                    y2={baselineY}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />

                  {/* Dynamic Index Line */}
                  <polyline
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsString}
                  />

                  {/* Data Points with Hover Interaction */}
                  {timeSeriesData.map((d, idx) => {
                    const cx = getX(idx)
                    const cy = getY(d.index)
                    const isHovered = hoveredDataPoint === idx

                    return (
                      <g
                        key={idx}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredDataPoint(idx)}
                        onMouseLeave={() => setHoveredDataPoint(null)}
                      >
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 6 : 3.5}
                          fill={isHovered ? '#f59e0b' : '#22d3ee'}
                          stroke="#020617"
                          strokeWidth="2"
                          className="transition-all"
                        />
                        {/* X-axis date labels */}
                        {(idx % 2 === 0 || idx === timeSeriesData.length - 1) && (
                          <text
                            x={cx}
                            y={svgHeight - 10}
                            fill="#64748b"
                            fontSize="9"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            {d.date}
                          </text>
                        )}
                      </g>
                    )
                  })}
                </svg>

                {/* Tooltip Overlay */}
                {hoveredDataPoint !== null && (
                  <div
                    className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-cyan-500/50 p-2.5 rounded-xl shadow-xl text-xs font-mono pointer-events-none flex items-center gap-3 backdrop-blur-md"
                  >
                    <div>
                      <span className="text-slate-400">Date:</span>{' '}
                      <span className="text-white font-bold">
                        {timeSeriesData[hoveredDataPoint].date}, 2026
                      </span>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-semibold">Airfare Index:</span>{' '}
                      <span className="text-white font-bold">
                        {timeSeriesData[hoveredDataPoint].index}
                      </span>
                    </div>
                    <div>
                      <span className="text-amber-400">Dev from Base:</span>{' '}
                      <span className="text-emerald-400 font-bold">
                        +{(timeSeriesData[hoveredDataPoint].index - 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
              <span>Axiomatic Jevons geometric chaining across 12,450 observation pairs</span>
              <span className="text-amber-400 font-semibold">Variance: σ = 2.84</span>
            </div>
          </div>

          {/* Right (1/3 width): Bar Chart Displaying Peak Fare Spikes */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white font-heading flex items-center justify-between">
                  <span>Peak Surge Spikes</span>
                  <span className="text-xs font-mono text-rose-400 font-bold">Top 5 Corridors</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Single-ticket volatility dampening analysis
                </p>
              </div>

              {/* Spikes List & Horizontal Progress Bars */}
              <div className="mt-4 space-y-4">
                {corridorSpikes.map((item) => (
                  <div key={item.corridor} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white font-mono">{item.corridor}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-400 text-[11px]">{item.base}</span>
                        <span className="text-slate-500">→</span>
                        <span className="text-rose-400 font-bold">{item.peakFare}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-500/30">
                          {item.spike}
                        </span>
                      </div>
                    </div>

                    {/* Bar visualization */}
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-rose-400 transition-all duration-500"
                        style={{ width: `${item.pct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
              <span className="text-amber-400 font-bold">MoSPI Note:</span> Jevons indexing compresses these spikes to prevent arithmetic Carli inflation distortion.
            </div>
          </div>

        </div>

        {/* Section 4 & 5: Live Scraper Table (2/3) + Sidebar Live Terminal (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Section 4: Live Scraper Activity Feed (2/3 width) */}
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
                <h3 className="text-base font-bold text-white font-heading">
                  Live Scraper Activity Feed
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Auto-ingesting across 14 workers
              </span>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-slate-400 border-b border-slate-800/80 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Route</th>
                    <th className="py-2.5 px-3 font-semibold">Provider / Carrier</th>
                    <th className="py-2.5 px-3 font-semibold">Booking Window</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Extracted Fare</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Validation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {liveFeeds.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">
                        {row.route}
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        {row.carrier}
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                          {row.window}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-bold text-cyan-300">
                        {row.extractedFare}
                      </td>

                      <td className="py-3 px-3 text-center">
                        {row.statusType === 'valid' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            Validated
                          </span>
                        )}
                        {row.statusType === 'cleaned' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[11px] font-semibold">
                            Fee Cleaned
                          </span>
                        )}
                        {row.statusType === 'normalizing' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-semibold">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Normalizing
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Decomposition: Standardized UDF, ADF, PSF & 5% GST deducted</span>
              <span className="text-cyan-400 font-semibold">Feed Latency: &lt; 850ms</span>
            </div>
          </div>

          {/* Section 5: Sidebar Live Terminal (1/3 width) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    Scraper Live Terminal
                  </h3>
                </div>
                <button
                  onClick={() => setIsTerminalStreaming(!isTerminalStreaming)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 px-2"
                  title={isTerminalStreaming ? 'Pause Stream' : 'Resume Stream'}
                >
                  {isTerminalStreaming ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                  <span className="font-mono text-[10px]">{isTerminalStreaming ? 'Live' : 'Paused'}</span>
                </button>
              </div>

              {/* Terminal Logs Window */}
              <div className="mt-3 rounded-xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-[11px] h-[280px] overflow-y-auto space-y-2 shadow-inner">
                {logs.map((log) => (
                  <div key={log.id} className="leading-relaxed flex items-start gap-1.5">
                    <span className="text-slate-500 shrink-0">{log.time}</span>
                    <span
                      className={`font-bold px-1 rounded text-[9px] shrink-0 ${
                        log.level === 'INFO'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800/60'
                          : log.level === 'FEE'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                          : log.level === 'PROXY'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800/60'
                          : log.level === 'MATH'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-slate-300 break-all">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Daemon pool healthy</span>
              </span>
              <span>Buffer: 100% ok</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
