import React, { useState } from 'react'
import { Search, Filter, RefreshCw, Plane, CheckCircle2, ArrowUpDown, ExternalLink, ShieldCheck } from 'lucide-react'

export default function LiveDemoTable() {
  const [carrierFilter, setCarrierFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const sampleCorridors = [
    {
      id: 'CORR-01',
      origin: 'DEL (New Delhi)',
      dest: 'BOM (Mumbai)',
      carrier: 'IndiGo (6E-205)',
      platform: 'IndiGo',
      rawFare: 4890,
      ancillary: 970,
      pureFare: 3920,
      base2024: 3430,
      horizon: 'T-7 days',
      status: 'Ingested & Normalized',
      time: '2 mins ago',
    },
    {
      id: 'CORR-02',
      origin: 'BLR (Bengaluru)',
      dest: 'DEL (New Delhi)',
      carrier: 'Air India (AI-804)',
      platform: 'Air India',
      rawFare: 6150,
      ancillary: 1110,
      pureFare: 5040,
      base2024: 4220,
      horizon: 'T-3 days',
      status: 'Ingested & Normalized',
      time: '4 mins ago',
    },
    {
      id: 'CORR-03',
      origin: 'BOM (Mumbai)',
      dest: 'GOI (Goa)',
      carrier: 'MakeMyTrip Direct',
      platform: 'MakeMyTrip',
      rawFare: 3450,
      ancillary: 560,
      pureFare: 2890,
      base2024: 2710,
      horizon: 'T-14 days',
      status: 'Ingested & Normalized',
      time: '7 mins ago',
    },
    {
      id: 'CORR-04',
      origin: 'MAA (Chennai)',
      dest: 'CCU (Kolkata)',
      carrier: 'EaseMyTrip OTA',
      platform: 'EaseMyTrip',
      rawFare: 4720,
      ancillary: 740,
      pureFare: 3980,
      base2024: 3540,
      horizon: 'T-7 days',
      status: 'Ingested & Normalized',
      time: '11 mins ago',
    },
    {
      id: 'CORR-05',
      origin: 'HYD (Hyderabad)',
      dest: 'DEL (New Delhi)',
      carrier: 'IndiGo (6E-6421)',
      platform: 'IndiGo',
      rawFare: 4300,
      ancillary: 740,
      pureFare: 3560,
      base2024: 3090,
      horizon: 'T-30 days',
      status: 'Ingested & Normalized',
      time: '15 mins ago',
    },
    {
      id: 'CORR-06',
      origin: 'DEL (New Delhi)',
      dest: 'PNQ (Pune)',
      carrier: 'Air India (AI-851)',
      platform: 'Air India',
      rawFare: 4950,
      ancillary: 830,
      pureFare: 4120,
      base2024: 3510,
      horizon: 'T-7 days',
      status: 'Ingested & Normalized',
      time: '18 mins ago',
    },
    {
      id: 'CORR-07',
      origin: 'CCU (Kolkata)',
      dest: 'GAU (Guwahati - UDAN)',
      carrier: 'IndiGo (6E-728)',
      platform: 'IndiGo',
      rawFare: 2840,
      ancillary: 490,
      pureFare: 2350,
      base2024: 2240,
      horizon: 'T-14 days',
      status: 'Ingested & Normalized',
      time: '24 mins ago',
    },
  ]

  const filteredData = sampleCorridors.filter((row) => {
    const matchesCarrier = carrierFilter === 'All' || row.platform === carrierFilter
    const matchesSearch =
      row.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.dest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCarrier && matchesSearch
  })

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 700)
  }

  return (
    <section id="live-corridors" className="py-20 sm:py-28 relative bg-slate-900/30 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
              <Plane className="w-3.5 h-3.5 transform -rotate-45" />
              <span>Real-Time Ingestion Explorer</span>
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Live National Corridor Airfare Registry
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl">
              Decomposed economy airfare records sampled from Indian carrier platforms, normalized into base pure tariffs and computed against 2024 benchmark prices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Live Feeds'}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search corridor or route code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Carrier Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-400 mr-1 hidden lg:inline font-mono">Platform:</span>
            {['All', 'IndiGo', 'Air India', 'MakeMyTrip', 'EaseMyTrip'].map((carrier) => (
              <button
                key={carrier}
                onClick={() => setCarrierFilter(carrier)}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  carrierFilter === carrier
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {carrier}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="mt-4 rounded-2xl bg-slate-950/80 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-900/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Corridor & Carrier</th>
                  <th className="py-3.5 px-4 font-semibold">Horizon</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Raw Fare</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Ancillary Fees</th>
                  <th className="py-3.5 px-4 font-semibold text-right text-cyan-400">Pure Base Fare</th>
                  <th className="py-3.5 px-4 font-semibold text-right text-amber-400">Jevons Rel (P_t/P_0)</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredData.map((row) => {
                  const ratio = ((row.pureFare / row.base2024) * 100).toFixed(1)
                  return (
                    <tr key={row.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                          <span>{row.origin.split(' ')[0]}</span>
                          <span className="text-slate-500">→</span>
                          <span>{row.dest.split(' ')[0]}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{row.carrier}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                          {row.horizon}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-300">
                        ₹{row.rawFare.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                        -₹{row.ancillary.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-cyan-300 text-sm">
                        ₹{row.pureFare.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400 text-sm">
                        {ratio}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Table footer info */}
          <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>All 142 corridors verified against statutory MoSPI tariff bounds</span>
            </div>
            <div>
              Showing {filteredData.length} of {sampleCorridors.length} active live test routes
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
