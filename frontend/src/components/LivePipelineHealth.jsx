import React from 'react'
import { Activity, CheckCircle2, XCircle, Gauge } from 'lucide-react'

export default function LivePipelineHealth() {
  const pipelines = [
    {
      airline: 'IndiGo (6E)',
      code: '6E',
      type: 'Direct Airline API',
      status: 'Active',
      performance: 99.8,
      speed: '380ms latency',
      statusType: 'active',
    },
    {
      airline: 'Air India (AI)',
      code: 'AI',
      type: 'Direct Airline API',
      status: 'Active',
      performance: 99.4,
      speed: '440ms latency',
      statusType: 'active',
    },
    {
      airline: 'SpiceJet (SG)',
      code: 'SG',
      type: 'Direct Airline Crawler',
      status: 'Active',
      performance: 98.7,
      speed: '510ms latency',
      statusType: 'active',
    },
    {
      airline: 'Akasa Air (QP)',
      code: 'QP',
      type: 'Direct Airline API',
      status: 'Active',
      performance: 99.6,
      speed: '390ms latency',
      statusType: 'active',
    },
    {
      airline: 'MakeMyTrip',
      code: 'MMT',
      type: 'OTA Aggregator',
      status: 'Active',
      performance: 99.2,
      speed: '460ms latency',
      statusType: 'active',
    },
    {
      airline: 'EaseMyTrip',
      code: 'EMT',
      type: 'OTA Aggregator',
      status: 'Active',
      performance: 99.5,
      speed: '410ms latency',
      statusType: 'active',
    },
    {
      airline: 'Alliance Air (9I)',
      code: '9I',
      type: 'Regional UDAN Feeder',
      status: 'Failed',
      performance: 14.2,
      speed: 'Timeout (> 8s)',
      statusType: 'failed',
    },
  ]

  return (
    <section id="pipeline-health" className="py-16 sm:py-20 relative bg-slate-950/60 border-t border-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>Surveillance Telemetry</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            Live Pipeline Health
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 font-mono">
            Real-time operational status and performance bars across carrier scrapers
          </p>
        </div>

        {/* Performance Definition Callout */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 shadow-md flex items-start gap-3 text-xs sm:text-sm text-slate-200">
          <Gauge className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-cyan-300">Performance</strong> measures how efficiently, quickly, and reliably your automated scrapers and data processors extract flight prices without failing or slowing down.
          </p>
        </div>

        {/* Pipeline Health Bars Container */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          {pipelines.map((item) => {
            const isActive = item.status === 'Active'
            return (
              <div key={item.airline} className="space-y-2 group">
                
                {/* Top Row: Airline Name, Type, Speed, Status Pill */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono text-sm">
                      {item.airline}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-400">
                      {item.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 font-mono">
                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      {item.speed}
                    </span>

                    <span className="font-bold text-white">
                      {item.performance}%
                    </span>

                    {/* Status: Active or Failed */}
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        Failed
                      </span>
                    )}
                  </div>
                </div>

                {/* Performance Bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 via-cyan-400 to-cyan-300 shadow-sm shadow-cyan-500/20'
                        : 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-sm shadow-rose-500/20'
                    }`}
                    style={{ width: `${item.performance}%` }}
                  ></div>
                </div>

              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 px-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>Active: Ingesting Nominal</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Failed: Scraper Fault / Timeout</span>
            </span>
          </div>
          <span>Fleet Health: 6 Active / 1 Failed</span>
        </div>

      </div>
    </section>
  )
}
