import React from "react";
import { Restaurant } from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";
import { getByText, render, screen } from "@testing-library/react";

describe("<Restaurant />", () => {
  const restaurantProps = {
    id: "1",
    name: "name",
    categoryName: "categoryName",
    coverImage: "x",
  };
  it("renders OK with props", () => {
    const { container } = render(
      <Router>
        <Restaurant {...restaurantProps} />
      </Router>
    );
    screen.getByText(restaurantProps.name);
    screen.getByText(restaurantProps.categoryName);
    expect(container.firstChild).toHaveAttribute(
      "href",
      `/restaurants/${restaurantProps.id}`
    );
  });
});
