// Mirrors data_simulator.py
// Generates a realistic simulated reading for a HEALTHY transformer using
// a normal (Gaussian) distribution around a safe operating center, then
// clamps to the healthy operating range.

// Box-Muller transform: gives us a normally-distributed random number
// since JavaScript's Math.random() is only uniform.
function randomNormal(mean, stdDev) {
  let u1 = 0, u2 = 0
  while (u1 === 0) u1 = Math.random()
  while (u2 === 0) u2 = Math.random()
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2)
  return mean + z0 * stdDev
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

// Healthy operating ranges (kept identical to the Streamlit version)
export const HEALTHY_RANGES = {
  voltage: { min: 220, max: 240, center: 230, std: 2 },
  current: { min: 40, max: 60, center: 50, std: 3 },
  temperature: { min: 50, max: 75, center: 60, std: 4 },
}

export function generateReading() {
  const { voltage, current, temperature } = HEALTHY_RANGES

  const v = clamp(randomNormal(voltage.center, voltage.std), voltage.min, voltage.max)
  const c = clamp(randomNormal(current.center, current.std), current.min, current.max)
  const t = clamp(randomNormal(temperature.center, temperature.std), temperature.min, temperature.max)

  return {
    timestamp: new Date(),
    voltage: Math.round(v * 100) / 100,
    current: Math.round(c * 100) / 100,
    temperature: Math.round(t * 100) / 100,
  }
}
