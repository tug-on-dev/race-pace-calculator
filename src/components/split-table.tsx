"use client";

import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTime, type Split, type UnitSystem } from "@/lib/calculations";

interface SplitTableProps {
  splits: Split[];
  unit: UnitSystem;
}

export function SplitTable({ splits, unit }: SplitTableProps) {
  const t = useTranslations("splits");
  const unitLabel = unit === "metric" ? "km" : "mi";

  if (splits.length === 0) {
    return (
      <p className="text-muted-foreground text-sm py-4">{t("noSplits")}</p>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">{t("splitNumber")}</TableHead>
            <TableHead>{t("splitDistance")} ({unitLabel})</TableHead>
            <TableHead>{t("splitTime")}</TableHead>
            <TableHead>{t("cumulativeTime")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {splits.map((split) => (
            <TableRow key={split.number}>
              <TableCell className="font-medium">{split.number}</TableCell>
              <TableCell>{split.distance.toFixed(2)}</TableCell>
              <TableCell className="font-mono">
                {formatTime(split.splitTimeSeconds)}
              </TableCell>
              <TableCell className="font-mono">
                {formatTime(split.cumulativeTimeSeconds)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
