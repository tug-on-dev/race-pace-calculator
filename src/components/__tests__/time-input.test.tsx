import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimeInput } from "../time-input";

describe("TimeInput", () => {
  it("should render with label", () => {
    render(<TimeInput label="Time" value="" onChange={() => {}} />);
    expect(screen.getByText("Time")).toBeInTheDocument();
  });

  it("should render with placeholder", () => {
    render(
      <TimeInput
        label="Pace"
        value=""
        onChange={() => {}}
        placeholder="MM:SS"
      />
    );
    expect(screen.getByPlaceholderText("MM:SS")).toBeInTheDocument();
  });

  it("should display the current value", () => {
    render(<TimeInput label="Time" value="01:30:00" onChange={() => {}} />);
    expect(screen.getByDisplayValue("01:30:00")).toBeInTheDocument();
  });

  it("should call onChange when user types", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<TimeInput label="Time" value="" onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "05:00");

    expect(handleChange).toHaveBeenCalled();
  });

  it("should use ariaLabel when provided", () => {
    render(
      <TimeInput
        label="Pace"
        value=""
        onChange={() => {}}
        ariaLabel="Enter pace in MM:SS"
      />
    );
    expect(screen.getByLabelText("Enter pace in MM:SS")).toBeInTheDocument();
  });
});
