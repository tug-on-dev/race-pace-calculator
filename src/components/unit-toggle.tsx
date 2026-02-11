"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { UnitSystem } from "@/lib/calculations";

interface UnitToggleProps {
  unit: UnitSystem;
  onChange: (unit: UnitSystem) => void;
}

export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  const t = useTranslations("nav");

  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label={t("units")}>
      <Button
        type="button"
        variant={unit === "metric" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("metric")}
        role="radio"
        aria-checked={unit === "metric"}
      >
        {t("metric")}
      </Button>
      <Button
        type="button"
        variant={unit === "imperial" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("imperial")}
        role="radio"
        aria-checked={unit === "imperial"}
      >
        {t("imperial")}
      </Button>
    </div>
  );
}
