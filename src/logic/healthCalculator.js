// Mirrors health_calculator.py — deduction-based health score (0-100)

export function calculateHealth({ voltage, current, temperature }) {
  let score = 100

  // Voltage
  if (voltage < 210 || voltage > 250) score -= 30
  else if (voltage < 220 || voltage > 240) score -= 10

  // Current
  if (current < 30 || current > 70) score -= 30
  else if (current < 40 || current > 60) score -= 10

  // Temperature
  if (temperature > 85) score -= 30
  else if (temperature > 75) score -= 15

  return Math.max(0, Math.min(100, score))
}

export function healthStatus(score) {
  if (score >= 90) return { label: 'Excellent', color: '#22c55e' }
  if (score >= 75) return { label: 'Good', color: '#3b82f6' }
  if (score >= 60) return { label: 'Fair', color: '#eab308' }
  return { label: 'Poor', color: '#ef4444' }
}
