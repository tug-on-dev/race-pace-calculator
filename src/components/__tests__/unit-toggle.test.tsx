import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UnitToggle } from "../unit-toggle";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      units: "Units",
      metric: "Metric (km)",
      imperial: "Imperial (mi)",
    };
    return translations[key] ?? key;
  },
}));

describe("UnitToggle", () => {
  it("should render metric and imperial buttons", () => {
    render(<UnitToggle unit="metric" onChange={() => {}} />);
    expect(screen.getByText("Metric (km)")).toBeInTheDocument();
    expect(screen.getByText("Imperial (mi)")).toBeInTheDocument();
  });

  it("should call onChange with imperial when imperial clicked", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<UnitToggle unit="metric" onChange={handleChange} />);

    await user.click(screen.getByText("Imperial (mi)"));
    expect(handleChange).toHaveBeenCalledWith("imperial");
  });

  it("should call onChange with metric when metric clicked", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<UnitToggle unit="imperial" onChange={handleChange} />);

    await user.click(screen.getByText("Metric (km)"));
    expect(handleChange).toHaveBeenCalledWith("metric");
  });

  it("should have correct aria-checked states", () => {
    render(<UnitToggle unit="metric" onChange={() => {}} />);
    expect(screen.getByRole("radio", { name: "Metric (km)" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
    expect(screen.getByRole("radio", { name: "Imperial (mi)" })).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });
});
