import React from "react";
import { Button } from "../button";
import { render, screen } from "@testing-library/react";

describe("<Button />", () => {
  it("should render OK with props", () => {
    const { rerender } = render(
      <Button canClick={true} loading={false} actionText={"test"} />
    );
    screen.getByText("test");
    rerender(<Button canClick={true} loading={true} actionText={"test"} />);
    screen.getByText("Loading...");
  });

  it("should display loading", () => {
    const { container } = render(
      <Button canClick={false} loading={true} actionText={"test"} />
    );
    screen.getByText("Loading...");
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});
