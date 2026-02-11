import { describe, it, expect } from "vitest";
import {
  convertDistance,
  calculatePace,
  calculateTime,
  calculateDistance,
  generateSplits,
  formatTime,
  formatPace,
  parseTime,
  distanceInUnit,
  distanceToKm,
  PRESET_DISTANCES,
} from "../calculations";

describe("convertDistance", () => {
  it("should return same value when converting same unit", () => {
    expect(convertDistance(10, "metric", "metric")).toBe(10);
    expect(convertDistance(10, "imperial", "imperial")).toBe(10);
  });

  it("should convert km to miles", () => {
    const result = convertDistance(10, "metric", "imperial");
    expect(result).toBeCloseTo(6.21371, 4);
  });

  it("should convert miles to km", () => {
    const result = convertDistance(10, "imperial", "metric");
    expect(result).toBeCloseTo(16.09344, 4);
  });

  it("should be reversible", () => {
    const km = 42.195;
    const mi = convertDistance(km, "metric", "imperial");
    const backToKm = convertDistance(mi, "imperial", "metric");
    expect(backToKm).toBeCloseTo(km, 4);
  });
});

describe("calculatePace", () => {
  it("should calculate pace for a 5K in 25 minutes", () => {
    const pace = calculatePace(5, 25 * 60);
    expect(pace).toBe(300); // 5:00 min/km
  });

  it("should calculate pace for a marathon in 4 hours", () => {
    const pace = calculatePace(42.195, 4 * 3600);
    expect(pace).toBeCloseTo(341.05, 0); // ~5:41 min/km
  });

  it("should return 0 for zero distance", () => {
    expect(calculatePace(0, 1800)).toBe(0);
  });

  it("should return 0 for negative distance", () => {
    expect(calculatePace(-5, 1800)).toBe(0);
  });
});

describe("calculateTime", () => {
  it("should calculate time for 10K at 5:00/km pace", () => {
    const time = calculateTime(10, 300);
    expect(time).toBe(3000); // 50:00
  });

  it("should calculate time for marathon at 5:41/km", () => {
    const time = calculateTime(42.195, 341);
    expect(time).toBeCloseTo(14388.495, 0);
  });

  it("should return 0 for zero distance", () => {
    expect(calculateTime(0, 300)).toBe(0);
  });
});

describe("calculateDistance", () => {
  it("should calculate distance from pace and time", () => {
    const distance = calculateDistance(300, 1500);
    expect(distance).toBe(5); // 5K at 5:00/km in 25 min
  });

  it("should return 0 for zero pace", () => {
    expect(calculateDistance(0, 1800)).toBe(0);
  });

  it("should return 0 for negative pace", () => {
    expect(calculateDistance(-300, 1800)).toBe(0);
  });
});

describe("generateSplits", () => {
  it("should generate splits for 5K with 1km intervals", () => {
    const splits = generateSplits(5, 300, 1);
    expect(splits).toHaveLength(5);
    expect(splits[0]).toEqual({
      number: 1,
      distance: 1,
      splitTimeSeconds: 300,
      cumulativeTimeSeconds: 300,
    });
    expect(splits[4]).toEqual({
      number: 5,
      distance: 5,
      splitTimeSeconds: 300,
      cumulativeTimeSeconds: 1500,
    });
  });

  it("should handle remainder distance", () => {
    const splits = generateSplits(5, 300, 2);
    expect(splits).toHaveLength(3);
    expect(splits[2].distance).toBe(5);
    expect(splits[2].splitTimeSeconds).toBeCloseTo(300, 0);
    expect(splits[2].cumulativeTimeSeconds).toBe(1500);
  });

  it("should generate splits for half marathon with 5km intervals", () => {
    const splits = generateSplits(21.0975, 300, 5);
    expect(splits).toHaveLength(5); // 4 full + 1 remainder
    expect(splits[4].distance).toBeCloseTo(21.0975, 4);
  });

  it("should return empty array for invalid inputs", () => {
    expect(generateSplits(0, 300, 1)).toEqual([]);
    expect(generateSplits(5, 0, 1)).toEqual([]);
    expect(generateSplits(5, 300, 0)).toEqual([]);
    expect(generateSplits(-5, 300, 1)).toEqual([]);
  });

  it("should handle interval larger than distance", () => {
    const splits = generateSplits(3, 300, 5);
    expect(splits).toHaveLength(1);
    expect(splits[0].distance).toBe(3);
    expect(splits[0].cumulativeTimeSeconds).toBe(900);
  });
});

describe("formatTime", () => {
  it("should format 0 seconds", () => {
    expect(formatTime(0)).toBe("00:00:00");
  });

  it("should format seconds only", () => {
    expect(formatTime(45)).toBe("00:00:45");
  });

  it("should format minutes and seconds", () => {
    expect(formatTime(125)).toBe("00:02:05");
  });

  it("should format hours, minutes, and seconds", () => {
    expect(formatTime(3661)).toBe("01:01:01");
  });

  it("should format marathon time (4 hours)", () => {
    expect(formatTime(14400)).toBe("04:00:00");
  });

  it("should round to nearest second", () => {
    expect(formatTime(59.6)).toBe("00:01:00");
    expect(formatTime(59.4)).toBe("00:00:59");
  });

  it("should handle negative input", () => {
    expect(formatTime(-10)).toBe("00:00:00");
  });

  it("should handle Infinity", () => {
    expect(formatTime(Infinity)).toBe("00:00:00");
  });
});

describe("formatPace", () => {
  it("should format 5:00 pace", () => {
    expect(formatPace(300)).toBe("05:00");
  });

  it("should format 4:30 pace", () => {
    expect(formatPace(270)).toBe("04:30");
  });

  it("should handle paces over 60 minutes", () => {
    expect(formatPace(3900)).toBe("65:00");
  });

  it("should handle negative input", () => {
    expect(formatPace(-10)).toBe("00:00");
  });
});

describe("parseTime", () => {
  it("should parse HH:MM:SS", () => {
    expect(parseTime("01:30:00")).toBe(5400);
  });

  it("should parse MM:SS", () => {
    expect(parseTime("05:30")).toBe(330);
  });

  it("should parse 00:00:00", () => {
    expect(parseTime("00:00:00")).toBe(0);
  });

  it("should handle leading/trailing spaces", () => {
    expect(parseTime("  01:30:00  ")).toBe(5400);
  });

  it("should return null for empty string", () => {
    expect(parseTime("")).toBeNull();
  });

  it("should return null for invalid format", () => {
    expect(parseTime("abc")).toBeNull();
    expect(parseTime("1:2:3:4")).toBeNull();
    expect(parseTime("5")).toBeNull();
  });

  it("should return null for invalid values (seconds >= 60)", () => {
    expect(parseTime("01:60:00")).toBeNull();
    expect(parseTime("05:61")).toBeNull();
  });

  it("should return null for negative values", () => {
    expect(parseTime("-1:00")).toBeNull();
  });

  it("should parse large hour values", () => {
    expect(parseTime("100:00:00")).toBe(360000);
  });
});

describe("distanceInUnit", () => {
  it("should return km for metric", () => {
    expect(distanceInUnit(42.195, "metric")).toBe(42.195);
  });

  it("should convert to miles for imperial", () => {
    expect(distanceInUnit(42.195, "imperial")).toBeCloseTo(26.2188, 3);
  });
});

describe("distanceToKm", () => {
  it("should return km for metric", () => {
    expect(distanceToKm(42.195, "metric")).toBe(42.195);
  });

  it("should convert from miles to km for imperial", () => {
    expect(distanceToKm(26.2188, "imperial")).toBeCloseTo(42.195, 2);
  });
});

describe("PRESET_DISTANCES", () => {
  it("should contain 7 preset distances", () => {
    expect(PRESET_DISTANCES).toHaveLength(7);
  });

  it("should have correct marathon distance", () => {
    const marathon = PRESET_DISTANCES.find((d) => d.id === "marathon");
    expect(marathon?.km).toBe(42.195);
  });

  it("should have correct half marathon distance", () => {
    const half = PRESET_DISTANCES.find((d) => d.id === "half");
    expect(half?.km).toBe(21.0975);
  });
});
