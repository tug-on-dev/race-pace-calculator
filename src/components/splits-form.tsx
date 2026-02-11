"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DistancePicker } from "@/components/distance-picker";
import { TimeInput } from "@/components/time-input";
import { UnitToggle } from "@/components/unit-toggle";
import { SplitTable } from "@/components/split-table";
import {
  type UnitSystem,
  type Split,
  PRESET_DISTANCES,
  distanceInUnit,
  parseTime,
  generateSplits,
  convertDistance,
} from "@/lib/calculations";

export function SplitsForm() {
  const t = useTranslations();

  const [unit, setUnit] = useState<UnitSystem>("metric");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [distanceValue, setDistanceValue] = useState("");
  const [paceValue, setPaceValue] = useState("");
  const [intervalValue, setIntervalValue] = useState("1");
  const [splits, setSplits] = useState<Split[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handlePresetSelect = useCallback(
    (presetId: string, dist: number) => {
      setSelectedPreset(presetId);
      if (presetId === "custom") {
        setDistanceValue("");
      } else {
        setDistanceValue(dist.toFixed(2));
      }
      setSplits([]);
      setError(null);
    },
    []
  );

  const handleDistanceChange = useCallback((val: string) => {
    setDistanceValue(val);
    setSelectedPreset("custom");
    setSplits([]);
    setError(null);
  }, []);

  const handleUnitChange = useCallback(
    (newUnit: UnitSystem) => {
      if (newUnit === unit) return;

      if (distanceValue) {
        const numVal = parseFloat(distanceValue);
        if (!isNaN(numVal) && numVal > 0) {
          const converted = convertDistance(numVal, unit, newUnit);
          setDistanceValue(converted.toFixed(2));
        }
      }

      if (selectedPreset && selectedPreset !== "custom") {
        const preset = PRESET_DISTANCES.find((p) => p.id === selectedPreset);
        if (preset) {
          setDistanceValue(distanceInUnit(preset.km, newUnit).toFixed(2));
        }
      }

      // Convert interval
      if (intervalValue) {
        const numVal = parseFloat(intervalValue);
        if (!isNaN(numVal) && numVal > 0) {
          const converted = convertDistance(numVal, unit, newUnit);
          setIntervalValue(converted.toFixed(2));
        }
      }

      setUnit(newUnit);
      setSplits([]);
      setError(null);
    },
    [unit, distanceValue, selectedPreset, intervalValue]
  );

  const handleGenerate = useCallback(() => {
    const dist = distanceValue ? parseFloat(distanceValue) : NaN;
    const pace = paceValue ? parseTime(paceValue) : null;
    const interval = intervalValue ? parseFloat(intervalValue) : NaN;

    if (isNaN(dist) || dist <= 0 || pace === null || pace <= 0) {
      setError(t("calculator.missingFields"));
      setSplits([]);
      return;
    }

    if (isNaN(interval) || interval <= 0) {
      setError(t("calculator.invalidInput"));
      setSplits([]);
      return;
    }

    setError(null);
    const result = generateSplits(dist, pace, interval);
    setSplits(result);
  }, [distanceValue, paceValue, intervalValue, t]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("splits.title")}</CardTitle>
          <CardDescription>{t("splits.description")}</CardDescription>
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
            onChange={(val) => {
              setPaceValue(val);
              setSplits([]);
              setError(null);
            }}
            placeholder="MM:SS"
            ariaLabel={t("calculator.enterPace")}
          />

          <div className="space-y-2">
            <Label>{t("splits.interval")} ({unit === "metric" ? t("common.km") : t("common.mi")})</Label>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              value={intervalValue}
              onChange={(e) => {
                setIntervalValue(e.target.value);
                setSplits([]);
                setError(null);
              }}
              className="max-w-xs"
              aria-label={t("splits.customInterval")}
            />
          </div>

          <Button onClick={handleGenerate}>{t("splits.generate")}</Button>

          {error && (
            <p className="text-destructive text-sm font-medium" role="alert">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      {splits.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <SplitTable splits={splits} unit={unit} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
