"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRESET_DISTANCES, type UnitSystem, distanceInUnit } from "@/lib/calculations";

interface DistancePickerProps {
  value: string;
  unit: UnitSystem;
  selectedPreset: string | null;
  onPresetSelect: (presetId: string, distanceInUnit: number) => void;
  onCustomChange: (value: string) => void;
}

export function DistancePicker({
  value,
  unit,
  selectedPreset,
  onPresetSelect,
  onCustomChange,
}: DistancePickerProps) {
  const t = useTranslations();

  return (
    <div className="space-y-3">
      <Label>{t("calculator.distance")}</Label>
      <div className="flex flex-wrap gap-2">
        {PRESET_DISTANCES.map((preset) => {
          const displayDist = distanceInUnit(preset.km, unit);
          return (
            <Button
              key={preset.id}
              type="button"
              variant={selectedPreset === preset.id ? "default" : "outline"}
              size="sm"
              onClick={() => onPresetSelect(preset.id, displayDist)}
              aria-label={`${t(preset.labelKey)} - ${displayDist.toFixed(2)} ${t(`common.${unit === "metric" ? "km" : "mi"}`)}`}
            >
              {t(preset.labelKey)}
            </Button>
          );
        })}
        <Button
          type="button"
          variant={selectedPreset === "custom" ? "default" : "outline"}
          size="sm"
          onClick={() => onPresetSelect("custom", 0)}
        >
          {t("distances.custom")}
        </Button>
      </div>
      <Input
        type="number"
        step="0.01"
        min="0"
        placeholder={t("calculator.enterDistance")}
        value={value}
        onChange={(e) => onCustomChange(e.target.value)}
        aria-label={`${t("calculator.distance")} (${t(`common.${unit === "metric" ? "km" : "mi"}`)})`}
        className="max-w-xs"
      />
      <p className="text-xs text-muted-foreground">
        {t(`common.${unit === "metric" ? "km" : "mi"}`)}
      </p>
    </div>
  );
}
