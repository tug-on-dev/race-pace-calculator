const KM_TO_MI = 0.621371;
const MI_TO_KM = 1.609344;

export type UnitSystem = "metric" | "imperial";

export interface Split {
  number: number;
  distance: number;
  splitTimeSeconds: number;
  cumulativeTimeSeconds: number;
}

export interface PresetDistance {
  id: string;
  labelKey: string;
  km: number;
}

export const PRESET_DISTANCES: PresetDistance[] = [
  { id: "5k", labelKey: "distances.5k", km: 5 },
  { id: "10k", labelKey: "distances.10k", km: 10 },
  { id: "15k", labelKey: "distances.15k", km: 15 },
  { id: "half", labelKey: "distances.half", km: 21.0975 },
  { id: "marathon", labelKey: "distances.marathon", km: 42.195 },
  { id: "ultra50k", labelKey: "distances.ultra50k", km: 50 },
  { id: "ultra100k", labelKey: "distances.ultra100k", km: 100 },
];

/**
 * Convert distance between km and miles.
 */
export function convertDistance(
  value: number,
  from: UnitSystem,
  to: UnitSystem
): number {
  if (from === to) return value;
  return from === "metric" ? value * KM_TO_MI : value * MI_TO_KM;
}

/**
 * Calculate pace in seconds per unit from distance (in current unit) and total time in seconds.
 */
export function calculatePace(
  distanceInUnit: number,
  totalTimeSeconds: number
): number {
  if (distanceInUnit <= 0) return 0;
  return totalTimeSeconds / distanceInUnit;
}

/**
 * Calculate total time in seconds from distance and pace (seconds per unit).
 */
export function calculateTime(
  distanceInUnit: number,
  paceSecondsPerUnit: number
): number {
  return distanceInUnit * paceSecondsPerUnit;
}

/**
 * Calculate distance from pace (seconds per unit) and total time in seconds.
 */
export function calculateDistance(
  paceSecondsPerUnit: number,
  totalTimeSeconds: number
): number {
  if (paceSecondsPerUnit <= 0) return 0;
  return totalTimeSeconds / paceSecondsPerUnit;
}

/**
 * Generate split intervals for a race.
 */
export function generateSplits(
  totalDistance: number,
  paceSecondsPerUnit: number,
  intervalDistance: number
): Split[] {
  if (totalDistance <= 0 || paceSecondsPerUnit <= 0 || intervalDistance <= 0) {
    return [];
  }

  const splits: Split[] = [];
  const fullIntervals = Math.floor(totalDistance / intervalDistance);
  const remainder = totalDistance % intervalDistance;

  for (let i = 1; i <= fullIntervals; i++) {
    splits.push({
      number: i,
      distance: i * intervalDistance,
      splitTimeSeconds: intervalDistance * paceSecondsPerUnit,
      cumulativeTimeSeconds: i * intervalDistance * paceSecondsPerUnit,
    });
  }

  if (remainder > 0.001) {
    splits.push({
      number: fullIntervals + 1,
      distance: totalDistance,
      splitTimeSeconds: remainder * paceSecondsPerUnit,
      cumulativeTimeSeconds: totalDistance * paceSecondsPerUnit,
    });
  }

  return splits;
}

/**
 * Format seconds into HH:MM:SS string.
 */
export function formatTime(totalSeconds: number): string {
  if (totalSeconds < 0 || !isFinite(totalSeconds)) return "00:00:00";

  const rounded = Math.round(totalSeconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Format seconds into MM:SS pace string.
 */
export function formatPace(totalSeconds: number): string {
  if (totalSeconds < 0 || !isFinite(totalSeconds)) return "00:00";

  const rounded = Math.round(totalSeconds);
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;

  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Parse HH:MM:SS or MM:SS string into total seconds.
 * Returns null if invalid.
 */
export function parseTime(str: string): number | null {
  const trimmed = str.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(":").map(Number);

  if (parts.some((p) => isNaN(p) || p < 0)) return null;

  if (parts.length === 3) {
    const [h, m, s] = parts;
    if (m >= 60 || s >= 60) return null;
    return h * 3600 + m * 60 + s;
  }

  if (parts.length === 2) {
    const [m, s] = parts;
    if (s >= 60) return null;
    return m * 60 + s;
  }

  return null;
}

/**
 * Get distance in the display unit from km.
 */
export function distanceInUnit(km: number, unit: UnitSystem): number {
  return unit === "metric" ? km : convertDistance(km, "metric", "imperial");
}

/**
 * Get distance in km from the display unit.
 */
export function distanceToKm(value: number, unit: UnitSystem): number {
  return unit === "metric" ? value : convertDistance(value, "imperial", "metric");
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}
