import { render, waitFor, screen } from "@testing-library/react";
import React from "react";
import { App } from "../app";
import { isLoggedInVar } from "../../apollo";

jest.mock("../../routers/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>,
  };
});
jest.mock("../../routers/logged-in-router", () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>,
  };
});

// it() => individual test
describe("<App />", () => {
  it("renders LoggedOutRouter", () => {
    render(<App />);
    screen.getByText("logged-out");
  });
  it("renders LoggedInRouter", async () => {
    render(<App />);
    await waitFor(() => {
      isLoggedInVar(true);
    });
    render(<App />);
    screen.getByText("logged-in");
  });
});
