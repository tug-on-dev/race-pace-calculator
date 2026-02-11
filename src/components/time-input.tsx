"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function TimeInput({
  label,
  value,
  onChange,
  placeholder = "HH:MM:SS",
  ariaLabel,
}: TimeInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel || label}
        className="max-w-xs font-mono"
      />
    </div>
  );
}
