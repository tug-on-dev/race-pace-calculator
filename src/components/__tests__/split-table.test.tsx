import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SplitTable } from "../split-table";
import type { Split } from "@/lib/calculations";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      splitNumber: "#",
      splitDistance: "Distance",
      splitTime: "Split Time",
      cumulativeTime: "Cumulative Time",
      noSplits: "Enter distance and pace to generate splits.",
    };
    return translations[key] ?? key;
  },
}));

describe("SplitTable", () => {
  const mockSplits: Split[] = [
    { number: 1, distance: 1, splitTimeSeconds: 300, cumulativeTimeSeconds: 300 },
    { number: 2, distance: 2, splitTimeSeconds: 300, cumulativeTimeSeconds: 600 },
    { number: 3, distance: 3, splitTimeSeconds: 300, cumulativeTimeSeconds: 900 },
  ];

  it("should render empty state when no splits", () => {
    render(<SplitTable splits={[]} unit="metric" />);
    expect(screen.getByText("Enter distance and pace to generate splits.")).toBeInTheDocument();
  });

  it("should render table with correct number of rows", () => {
    render(<SplitTable splits={mockSplits} unit="metric" />);
    const rows = screen.getAllByRole("row");
    // header + 3 data rows
    expect(rows).toHaveLength(4);
  });

  it("should render split distances", () => {
    render(<SplitTable splits={mockSplits} unit="metric" />);
    expect(screen.getByText("1.00")).toBeInTheDocument();
    expect(screen.getByText("2.00")).toBeInTheDocument();
    expect(screen.getByText("3.00")).toBeInTheDocument();
  });

  it("should render formatted times", () => {
    render(<SplitTable splits={mockSplits} unit="metric" />);
    // 300s = 00:05:00 appears in all 3 split time cells + 1 cumulative cell = 4
    expect(screen.getAllByText("00:05:00")).toHaveLength(4);
    expect(screen.getByText("00:10:00")).toBeInTheDocument();
    expect(screen.getByText("00:15:00")).toBeInTheDocument();
  });

  it("should display km header for metric", () => {
    render(<SplitTable splits={mockSplits} unit="metric" />);
    expect(screen.getByText("Distance (km)")).toBeInTheDocument();
  });

  it("should display mi header for imperial", () => {
    render(<SplitTable splits={mockSplits} unit="imperial" />);
    expect(screen.getByText("Distance (mi)")).toBeInTheDocument();
  });
});
