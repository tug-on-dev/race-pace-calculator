"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DistancePicker } from "@/components/distance-picker";
import { TimeInput } from "@/components/time-input";
import { UnitToggle } from "@/components/unit-toggle";
import {
  type UnitSystem,
  PRESET_DISTANCES,
  distanceInUnit,
  calculatePace,
  calculateTime,
  calculateDistance,
  parseTime,
  formatTime,
  formatPace,
  convertDistance,
} from "@/lib/calculations";

export function CalculatorForm() {
  const t = useTranslations();

  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [distanceValue, setDistanceValue] = useState("");
  const [paceValue, setPaceValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [result, setResult] = useState<{
    field: "distance" | "pace" | "time";
    label: string;
    value: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePresetSelect = useCallback(
    (presetId: string, dist: number) => {
      setSelectedPreset(presetId);
      if (presetId === "custom") {
        setDistanceValue("");
      } else {
        setDistanceValue(dist.toFixed(2));
      }
      setResult(null);
      setError(null);
    },
    []
  );

  const handleDistanceChange = useCallback((val: string) => {
    setDistanceValue(val);
    setSelectedPreset("custom");
    setResult(null);
    setError(null);
  }, []);

  const handlePaceChange = useCallback((val: string) => {
    setPaceValue(val);
    setResult(null);
    setError(null);
  }, []);

  const handleTimeChange = useCallback((val: string) => {
    setTimeValue(val);
    setResult(null);
    setError(null);
  }, []);

  const handleUnitChange = useCallback(
    (newUnit: UnitSystem) => {
      if (newUnit === unit) return;

      // Convert distance value
      if (distanceValue) {
        const numVal = parseFloat(distanceValue);
        if (!isNaN(numVal) && numVal > 0) {
          const converted = convertDistance(numVal, unit, newUnit);
          setDistanceValue(converted.toFixed(2));
        }
      }

      // Re-select preset distance in new unit
      if (selectedPreset && selectedPreset !== "custom") {
        const preset = PRESET_DISTANCES.find((p) => p.id === selectedPreset);
        if (preset) {
          setDistanceValue(distanceInUnit(preset.km, newUnit).toFixed(2));
        }
      }

      setUnit(newUnit);
      setResult(null);
      setError(null);
    },
    [unit, distanceValue, selectedPreset]
  );

  const handleCalculate = useCallback(() => {
    const dist = distanceValue ? parseFloat(distanceValue) : NaN;
    const pace = paceValue ? parseTime(paceValue) : null;
    const time = timeValue ? parseTime(timeValue) : null;

    const hasDistance = !isNaN(dist) && dist > 0;
    const hasPace = pace !== null && pace > 0;
    const hasTime = time !== null && time > 0;

    const filledCount = [hasDistance, hasPace, hasTime].filter(Boolean).length;

    if (filledCount < 2) {
      setError(t("calculator.missingFields"));
      setResult(null);
      return;
    }

    setError(null);

    if (hasDistance && hasPace && !hasTime) {
      const totalTime = calculateTime(dist, pace);
      setResult({
        field: "time",
        label: t("calculator.time"),
        value: formatTime(totalTime),
      });
    } else if (hasDistance && hasTime && !hasPace) {
      const paceResult = calculatePace(dist, time);
      const paceUnit = unit === "metric" ? t("calculator.perKm") : t("calculator.perMi");
      setResult({
        field: "pace",
        label: t("calculator.pace"),
        value: `${formatPace(paceResult)} ${paceUnit}`,
      });
    } else if (hasPace && hasTime && !hasDistance) {
      const distResult = calculateDistance(pace, time);
      const unitLabel = unit === "metric" ? t("common.km") : t("common.mi");
      setResult({
        field: "distance",
        label: t("calculator.distance"),
        value: `${distResult.toFixed(2)} ${unitLabel}`,
      });
    } else {
      // All three filled — recalculate time from distance + pace
      const totalTime = calculateTime(dist, pace!);
      setResult({
        field: "time",
        label: t("calculator.time"),
        value: formatTime(totalTime),
      });
    }
  }, [distanceValue, paceValue, timeValue, unit, t]);

  const handleReset = useCallback(() => {
    setDistanceValue("");
    setPaceValue("");
    setTimeValue("");
    setSelectedPreset(null);
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("calculator.title")}</CardTitle>
          <CardDescription>{t("calculator.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <UnitToggle unit={unit} onChange={handleUnitChange} />

          <DistancePicker
            value={distanceValue}
            unit={unit}
            selectedPreset={selectedPreset}
            onPresetSelect={handlePresetSelect}
            onCustomChange={handleDistanceChange}
          />

          <TimeInput
            label={`${t("calculator.pace")} (${unit === "metric" ? t("calculator.perKm") : t("calculator.perMi")})`}
            value={paceValue}
            onChange={handlePaceChange}
            placeholder="MM:SS"
            ariaLabel={t("calculator.enterPace")}
          />

          <TimeInput
            label={t("calculator.time")}
            value={timeValue}
            onChange={handleTimeChange}
            placeholder="HH:MM:SS"
            ariaLabel={t("calculator.enterTime")}
          />

          <div className="flex gap-3">
            <Button onClick={handleCalculate}>{t("calculator.calculate")}</Button>
            <Button variant="outline" onClick={handleReset}>
              {t("calculator.reset")}
            </Button>
          </div>

          {error && (
            <p className="text-destructive text-sm font-medium" role="alert">
              {error}
            </p>
          )}

          {result && (
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{result.label}</p>
                <p className="text-3xl font-bold font-mono" data-testid="result-value">
                  {result.value}
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
