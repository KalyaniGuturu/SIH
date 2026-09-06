import React, { useState } from 'react'
import {
  Plane,
  ArrowLeft,
  Search,
  Calendar,
  Filter,
  ShieldCheck,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  Info,
  ExternalLink,
  Radio,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export default function RouteAnalytics({ onBackToLanding, onGoToDashboard }) {
  // Route selection
  const routesList = [
    {
      id: 'DEL-BOM',
      originCode: 'DEL',
      originCity: 'Delhi (IGI T3)',
      destCode: 'BOM',
      destCity: 'Mumbai (CSMIA T2)',
      distance: '1,148 km',
      duration: '2h 15m',
      dailyFlights: 84,
      avgPrice: '₹5,840',
      routeIndex: 118.4,
      variance: '+1.2%',
      weight: '8.4%',
    },
    {
      id: 'BLR-DEL',
      originCode: 'BLR',
      originCity: 'Bengaluru (KIA T1/T2)',
      destCode: 'DEL',
      destCity: 'Delhi (IGI T3)',
      distance: '1,740 km',
      duration: '2h 45m',
      dailyFlights: 68,
      avgPrice: '₹6,450',
      routeIndex: 122.1,
      variance: '+2.8%',
      weight: '7.2%',
    },
    {
      id: 'BOM-BLR',
      originCode: 'BOM',
      originCity: 'Mumbai (CSMIA T2)',
      destCode: 'BLR',
      destCity: 'Bengaluru (KIA T1)',
      distance: '840 km',
      duration: '1h 45m',
      dailyFlights: 54,
      avgPrice: '₹4,950',
      routeIndex: 112.6,
      variance: '-0.8%',
      weight: '6.1%',
    },
    {
      id: 'CCU-DEL',
      originCode: 'CCU',
      originCity: 'Kolkata (NSCBIA)',
      destCode: 'DEL',
      destCity: 'Delhi (IGI T2/T3)',
      distance: '1,305 km',
      duration: '2h 20m',
      dailyFlights: 42,
      avgPrice: '₹5,320',
      routeIndex: 115.8,
      variance: '+0.5%',
      weight: '4.8%',
    },
    {
      id: 'DEL-GOI',
      originCode: 'DEL',
      originCity: 'Delhi (IGI T3)',
      destCode: 'GOI',
      destCity: 'Goa (Dabolim / Mopa)',
      distance: '1,510 km',
      duration: '2h 35m',
      dailyFlights: 36,
      avgPrice: '₹6,890',
      routeIndex: 128.4,
      variance: '+4.2%',
      weight: '3.9%',
    },
  ]

  const [selectedRouteId, setSelectedRouteId] = useState('DEL-BOM')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState('30d')
  const [carrierFilter, setCarrierFilter] = useState('all') // 'all' | 'direct' | 'ota'
  const [isRadarHovered, setIsRadarHovered] = useState(false)

  const activeRoute = routesList.find((r) => r.id === selectedRouteId) || routesList[0]

  // Filtered dropdown list
  const filteredRoutes = routesList.filter(
    (r) =>
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.originCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.destCity.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Carrier Comparison Dataset
  const carrierComparisonData = [
    {
      name: 'IndiGo (6E)',
      type: 'Direct Airline',
      isOTA: false,
      baseFare: 5840,
      convenienceStripped: 400,
      statutoryFees: 580,
      finalCleanFare: 4860,
      successRate: '99.8%',
      status: 'Active API',
    },
    {
      name: 'Air India (AI)',
      type: 'Direct Airline',
      isOTA: false,
      baseFare: 6250,
      convenienceStripped: 450,
      statutoryFees: 620,
      finalCleanFare: 5180,
      successRate: '99.4%',
      status: 'Active API',
    },
    {
      name: 'SpiceJet (SG)',
      type: 'Direct Airline',
      isOTA: false,
      baseFare: 5490,
      convenienceStripped: 375,
      statutoryFees: 540,
      finalCleanFare: 4575,
      successRate: '98.9%',
      status: 'Active Crawler',
    },
    {
      name: 'Akasa Air (QP)',
      type: 'Direct Airline',
      isOTA: false,
      baseFare: 5380,
      convenienceStripped: 350,
      statutoryFees: 530,
      finalCleanFare: 4500,
      successRate: '99.6%',
      status: 'Active API',
    },
    {
      name: 'MakeMyTrip',
      type: 'OTA Aggregator',
      isOTA: true,
      baseFare: 5990,
      convenienceStripped: 549,
      statutoryFees: 580,
      finalCleanFare: 4861,
      successRate: '99.2%',
      status: 'Dynamic Interceptor',
    },
    {
      name: 'EaseMyTrip',
      type: 'OTA Aggregator',
      isOTA: true,
      baseFare: 5840,
      convenienceStripped: 0, // EMT promotes zero convenience fee
      statutoryFees: 580,
      finalCleanFare: 5260,
      successRate: '99.5%',
      status: 'Dynamic Interceptor',
    },
    {
      name: 'Cleartrip',
      type: 'OTA Aggregator',
      isOTA: true,
      baseFare: 6020,
      convenienceStripped: 499,
      statutoryFees: 580,
      finalCleanFare: 4941,
      successRate: '98.7%',
      status: 'Dynamic Interceptor',
    },
  ]

  const filteredCarriers = carrierComparisonData.filter((c) => {
    if (carrierFilter === 'direct') return !c.isOTA
    if (carrierFilter === 'ota') return c.isOTA
    return true
  })

  // Advance Window Price Curve Data (Escalation as departure approaches)
  const advanceCurve = [
    { window: '30 Days Out', days: 30, price: 3890, index: 102.1, status: 'Economy Early Bird' },
    { window: '15 Days Out', days: 15, price: 4450, index: 109.4, status: 'Standard Booking' },
    { window: '7 Days Out', days: 7, price: 5840, index: 118.4, status: 'Surge Acceleration' },
    { window: '0–3 Days (Same Day)', days: 2, price: 9650, index: 148.2, status: 'Peak Dynamic Surge' },
  ]

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
            onClick={onGoToDashboard}
            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium px-2 py-1 rounded bg-slate-900 border border-slate-800 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Executive Dashboard</span>
          </button>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline font-semibold text-slate-300">
            Route Analytics & Radar Surveillance
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Corridor Telemetry Synchronized</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-grow">
        
        {/* Component 1: Route Selector Header */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Left: Corridor Title & Icon */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 via-slate-900 to-slate-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white font-heading tracking-tight">
                  {activeRoute.originCode} ✈️ {activeRoute.destCode}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {activeRoute.originCity} to {activeRoute.destCity}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Distance: {activeRoute.distance} • Duration: {activeRoute.duration} • {activeRoute.dailyFlights} Daily Flights
              </p>
            </div>
          </div>

          {/* Right: Route Dropdown Selector + Search + Date Range */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            
            {/* Route Dropdown */}
            <div className="relative">
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer shadow-inner pr-8"
              >
                {routesList.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                    {r.originCode} ✈️ {r.destCode} ({r.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter route..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Date-Range Picker */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
              {['7d', '15d', '30d', '90d'].map((r) => (
                <button
                  key={r}
                  onClick={() => setDateRange(r)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    dateRange === r
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Component 2: Live Flight Radar Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Cyber Radar Background Pattern */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

          {/* Radar Header */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                <h3 className="text-base font-bold text-white font-heading">
                  Active Corridor Flight Radar
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  SECTOR LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Surveillance sweep along primary domestic airway Q21 / W10
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-slate-400">
                National Weight: <span className="text-amber-400 font-bold">{activeRoute.weight}</span>
              </div>
              <div className="text-slate-400">
                Route Jevons Index:{' '}
                <span className="text-cyan-300 font-bold">{activeRoute.routeIndex}</span>
              </div>
            </div>
          </div>

          {/* Radar Visual Display Area */}
          <div
            className="relative mt-6 h-64 sm:h-72 w-full rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between px-8 sm:px-20 overflow-hidden cursor-crosshair group"
            onMouseEnter={() => setIsRadarHovered(true)}
            onMouseLeave={() => setIsRadarHovered(false)}
          >
            {/* Circular radar range rings */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-cyan-500/10 pointer-events-none" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-cyan-500/5 pointer-events-none" />
            
            {/* Animated Radar Sweep Line */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-transparent pointer-events-none animate-spin-slow opacity-30">
              <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent to-cyan-400 origin-right"></div>
            </div>

            {/* Left Glowing Node: Origin Airport */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-12 h-12 rounded-full bg-cyan-500/20 animate-ping"></span>
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-mono font-bold shadow-lg shadow-cyan-500/30">
                  {activeRoute.originCode}
                </div>
              </div>
              <span className="mt-2 text-xs font-bold text-white font-mono">
                {activeRoute.originCode}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {activeRoute.originCity.split(' ')[0]}
              </span>
            </div>

            {/* SVG Connecting Arc with Aircraft Icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="arcGlow" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
                
                {/* Arc dotted line */}
                <path
                  d="M 120 120 Q 300 40 480 120"
                  fill="none"
                  stroke="url(#arcGlow)"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  className="animate-pulse"
                />
              </svg>

              {/* Mid-flight aircraft icon */}
              <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
                <div className="relative group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/30 transform -rotate-12 transition-transform hover:scale-125">
                    <Plane className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Glowing Node: Destination Airport */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <span className="absolute w-12 h-12 rounded-full bg-amber-500/20 animate-ping"></span>
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-mono font-bold shadow-lg shadow-amber-500/30">
                  {activeRoute.destCode}
                </div>
              </div>
              <span className="mt-2 text-xs font-bold text-white font-mono">
                {activeRoute.destCode}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {activeRoute.destCity.split(' ')[0]}
              </span>
            </div>

            {/* Overlay Hover Tooltip Displaying Specified Metrics */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2.5 rounded-xl bg-slate-950/95 border border-cyan-400 shadow-2xl backdrop-blur-xl flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-cyan-300">
                <span className="text-slate-400">Price:</span>
                <span className="font-bold text-white text-sm">{activeRoute.avgPrice}</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1.5 text-amber-400">
                <span className="text-slate-400">Route Index:</span>
                <span className="font-bold text-amber-300">{activeRoute.routeIndex}</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="text-slate-400">Daily Variance:</span>
                <span className="font-bold">{activeRoute.variance}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Component 3: Carrier Comparison Table */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Carrier & OTA Decomposition Comparison
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparing Direct Airlines vs. Online Travel Aggregators on {activeRoute.id}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              {[
                { id: 'all', label: 'All Providers' },
                { id: 'direct', label: 'Direct Airlines' },
                { id: 'ota', label: 'OTAs' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setCarrierFilter(pill.id)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    carrierFilter === pill.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-slate-400 border-b border-slate-800/80 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-semibold">Carrier / Platform Name</th>
                  <th className="py-3 px-4 font-semibold text-right">Base Fare</th>
                  <th className="py-3 px-4 font-semibold text-right text-rose-400">Convenience Fee Stripped</th>
                  <th className="py-3 px-4 font-semibold text-right text-cyan-400">Final Clean Fare</th>
                  <th className="py-3 px-4 font-semibold text-center">Scrape Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredCarriers.map((carrier) => (
                  <tr key={carrier.name} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{carrier.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            carrier.isOTA
                              ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                              : 'bg-blue-950/80 text-blue-300 border border-blue-800/60'
                          }`}
                        >
                          {carrier.type}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-200">
                      ₹{carrier.baseFare.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right text-rose-400">
                      {carrier.convenienceStripped > 0 ? (
                        <span>-₹{carrier.convenienceStripped.toLocaleString()}</span>
                      ) : (
                        <span className="text-slate-500 font-semibold">₹0 (Waived)</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-extrabold text-cyan-300 text-sm">
                      ₹{carrier.finalCleanFare.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        {carrier.successRate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>MoSPI Normalizer: Excludes dynamic OTA payment gate markups</span>
            <span className="text-amber-400 font-semibold">Clean Fare Variance: &plusmn;₹310</span>
          </div>

        </div>

        {/* Component 4: Advance Window Price Curve Chart */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white font-heading">
                  Advance Window Price Escalation Curve
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Dynamic price escalation tracking departure proximity (30 days out &rarr; 15 days &rarr; 7 days &rarr; Same day)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold">
                2.48x Escalation at T-0
              </span>
            </div>
          </div>

          {/* Visual Step Curve & Progress Metrics */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {advanceCurve.map((tier, idx) => (
              <div
                key={tier.window}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Step 0{idx + 1}</span>
                    <span className="text-slate-500 font-bold">{tier.days}d window</span>
                  </div>
                  <div className="mt-2 font-bold text-white text-sm font-heading">
                    {tier.window}
                  </div>
                  <div className="mt-3 text-2xl font-extrabold font-mono text-amber-400">
                    ₹{tier.price.toLocaleString()}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Index: {tier.index}</span>
                  <span className="text-emerald-400 font-semibold">{tier.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* SVG Escalation Trajectory Chart */}
          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
            <svg viewBox="0 0 700 160" className="w-full h-36 min-w-[500px]">
              <defs>
                <linearGradient id="curveGlow" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="50" y1="30" x2="650" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="50" y1="80" x2="650" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="50" y1="130" x2="650" y2="130" stroke="#1e293b" strokeDasharray="3 3" />

              {/* Trajectory Polyline */}
              <polyline
                fill="none"
                stroke="url(#curveGlow)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="100,125 260,110 440,80 600,35"
              />

              {/* Data points */}
              <circle cx="100" cy="125" r="5" fill="#22d3ee" stroke="#020617" strokeWidth="2" />
              <text x="100" y="145" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                30 Days (₹3.8k)
              </text>

              <circle cx="260" cy="110" r="5" fill="#38bdf8" stroke="#020617" strokeWidth="2" />
              <text x="260" y="130" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                15 Days (₹4.4k)
              </text>

              <circle cx="440" cy="80" r="6" fill="#f59e0b" stroke="#020617" strokeWidth="2" />
              <text x="440" y="100" fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                7 Days (₹5.8k)
              </text>

              <circle cx="600" cy="35" r="7" fill="#f43f5e" stroke="#020617" strokeWidth="2" />
              <text x="600" y="25" fill="#f43f5e" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                0–3 Days (₹9.6k)
              </text>
            </svg>
          </div>

        </div>

      </div>

    </div>
  )
}
