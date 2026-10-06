import { useEffect, useState } from 'react'
import { generateReading, HEALTHY_RANGES } from './logic/dataSimulator'
import { calculateHealth, healthStatus } from './logic/healthCalculator'

function MetricCard({ label, value, unit, range, icon, gradient }) {
  const pct = Math.max(
    0,
    Math.min(100, ((value - range.min) / (range.max - range.min)) * 100)
  )
  return (
    <div
      className="relative rounded-3xl p-8 text-white overflow-hidden shadow-2xl flex-1 min-w-[260px]"
      style={{ background: gradient }}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{icon}</span>
          <p className="text-base font-semibold tracking-wide uppercase opacity-90">
            {label}
          </p>
        </div>
        <p className="text-6xl font-extrabold leading-none">
          {value.toFixed(2)}
          <span className="text-2xl font-medium ml-2 opacity-80">{unit}</span>
        </p>
        <div className="mt-6 h-2.5 rounded-full bg-white/25 overflow-hidden">
          <div
            className="h-full roundeqd-full bg-white transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-sm mt-2 opacity-80">
          Healthy range: {range.min}–{range.max} {unit}
        </p>
      </div>
    </div>
  )
}

function HealthGauge({ score }) {
  const status = healthStatus(score)
  const radius = 90
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="rounded-3xl p-8 bg-slate-800/70 backdrop-blur border border-slate-700/50 shadow-2xl flex flex-col items-center justify-center flex-1 min-w-[300px]">
      <p className="text-base font-semibold tracking-wide uppercase text-slate-300 mb-4">
        🩺 Transformer Health Score
      </p>
      <div className="relative w-56 h-56">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 220 220">
          <circle
            cx="110" cy="110" r={radius}
            fill="none" stroke="#334155" strokeWidth="16"
          />
          <circle
            cx="110" cy="110" r={radius}
            fill="none" stroke={status.color} strokeWidth="16"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.7s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-extrabold" style={{ color: status.color }}>
            {score}%
          </span>
          <span
            className="mt-2 px-4 py-1 rounded-full text-sm font-semibold"
            style={{ background: status.color + '22', color: status.color }}
          >
            {status.label}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [reading, setReading] = useState(generateReading())

  useEffect(() => {
    const interval = setInterval(() => setReading(generateReading()), 1000)
    return () => clearInterval(interval)
  }, [])

  const score = calculateHealth(reading)

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col">
      <header className="px-10 py-8 flex items-center justify-between flex-wrap gap-4 border-b border-slate-800">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <span>⚡</span> Smart Transformer Monitoring Dashboard
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Real-Time Equipment Monitoring & Data Logging Platform — Minor 1
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/70 border border-slate-700 rounded-full px-5 py-2.5">
          <span className="w-3 h-3 rounded-full bg-green-400 live-dot" />
          <span className="text-base text-slate-300">
            Live · Last updated {reading.timestamp.toLocaleTimeString()}
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center px-10 py-12 gap-8">
        <div className="flex flex-wrap gap-6">
          <MetricCard
            label="Voltage"
            value={reading.voltage}
            unit="V"
            icon="🔌"
            range={HEALTHY_RANGES.voltage}
            gradient="linear-gradient(135deg,#6366f1,#8b5cf6)"
          />
          <MetricCard
            label="Current"
            value={reading.current}
            unit="A"
            icon="🔋"
            range={HEALTHY_RANGES.current}
            gradient="linear-gradient(135deg,#8b5cf6,#d946ef)"
          />
          <MetricCard
            label="Temperature"
            value={reading.temperature}
            unit="°C"
            icon="🌡️"
            range={HEALTHY_RANGES.temperature}
            gradient="linear-gradient(135deg,#ec4899,#f43f5e)"
          />
        </div>
        <div className="flex flex-wrap gap-6">
          <HealthGauge score={score} />
          <div className="flex-1 min-w-[300px] rounded-3xl p-8 bg-slate-800/40 backdrop-blur border border-slate-700/50 shadow-2xl flex flex-col justify-center gap-4">
            <p className="text-base font-semibold tracking-wide uppercase text-slate-300 mb-2">
              📋 System Status
            </p>
            <StatusRow label="Voltage" value={reading.voltage} range={HEALTHY_RANGES.voltage} unit="V" />
            <StatusRow label="Current" value={reading.current} range={HEALTHY_RANGES.current} unit="A" />
            <StatusRow label="Temperature" value={reading.temperature} range={HEALTHY_RANGES.temperature} unit="°C" />
          </div>
        </div>
      </main>

      <footer className="text-center text-sm text-slate-500 pb-6">
        Simulated healthy-transformer data · Phase 1 software prototype
      </footer>
    </div>
  )
}

function StatusRow({ label, value, range, unit }) {
  const inRange = value >= range.min && value <= range.max
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
      <span className="text-slate-300 text-lg">{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-semibold text-lg">{value.toFixed(2)} {unit}</span>
        <span
          className={`w-2.5 h-2.5 rounded-full ${inRange ? 'bg-green-400' : 'bg-red-400'}`}
        />
      </div>
    </div>
  )
}