import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DistancePicker } from "../distance-picker";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "calculator.distance": "Distance",
      "calculator.enterDistance": "Enter distance",
      "distances.5k": "5K",
      "distances.10k": "10K",
      "distances.15k": "15K",
      "distances.half": "Half Marathon",
      "distances.marathon": "Marathon",
      "distances.ultra50k": "Ultra 50K",
      "distances.ultra100k": "Ultra 100K",
      "distances.custom": "Custom",
      "common.km": "km",
      "common.mi": "mi",
    };
    return translations[key] ?? key;
  },
}));

describe("DistancePicker", () => {
  const defaultProps = {
    value: "",
    unit: "metric" as const,
    selectedPreset: null,
    onPresetSelect: vi.fn(),
    onCustomChange: vi.fn(),
  };

  it("should render all preset distance buttons", () => {
    render(<DistancePicker {...defaultProps} />);
    expect(screen.getByText("5K")).toBeInTheDocument();
    expect(screen.getByText("10K")).toBeInTheDocument();
    expect(screen.getByText("15K")).toBeInTheDocument();
    expect(screen.getByText("Half Marathon")).toBeInTheDocument();
    expect(screen.getByText("Marathon")).toBeInTheDocument();
    expect(screen.getByText("Ultra 50K")).toBeInTheDocument();
    expect(screen.getByText("Ultra 100K")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("should call onPresetSelect when preset clicked", async () => {
    const onPresetSelect = vi.fn();
    const user = userEvent.setup();
    render(<DistancePicker {...defaultProps} onPresetSelect={onPresetSelect} />);

    await user.click(screen.getByText("5K"));
    expect(onPresetSelect).toHaveBeenCalledWith("5k", 5);
  });

  it("should call onCustomChange when input changes", async () => {
    const onCustomChange = vi.fn();
    const user = userEvent.setup();
    render(<DistancePicker {...defaultProps} onCustomChange={onCustomChange} />);

    const input = screen.getByPlaceholderText("Enter distance");
    await user.type(input, "7.5");
    expect(onCustomChange).toHaveBeenCalled();
  });

  it("should display distance input with value", () => {
    render(<DistancePicker {...defaultProps} value="42.20" />);
    expect(screen.getByDisplayValue("42.20")).toBeInTheDocument();
  });

  it("should show km unit label for metric", () => {
    render(<DistancePicker {...defaultProps} />);
    expect(screen.getByText("km")).toBeInTheDocument();
  });

  it("should show mi unit label for imperial", () => {
    render(<DistancePicker {...defaultProps} unit="imperial" />);
    expect(screen.getByText("mi")).toBeInTheDocument();
  });
});
