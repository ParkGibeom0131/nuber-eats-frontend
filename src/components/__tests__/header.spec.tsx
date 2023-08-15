import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Header } from "../header";
import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter as Router } from "react-router-dom";
import { ME_QUERY } from "../../hooks/useMe";

// getByText => element를 찾지 못하면 테스트에 실패
// queryByText => 뭔가가 존재하지 않는지 확인할 때

describe("<Header />", () => {
  it("renders verify banner", async () => {
    await waitFor(async () => {
      render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: "1",
                    email: "",
                    role: "",
                    verified: "false",
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      screen.getByText("Please verify your email.");
    });
  });
  it("renders without verify banner", async () => {
    await waitFor(async () => {
      render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: "1",
                    email: "",
                    role: "",
                    verified: "true",
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(
        screen.queryByText("<span>Please verify your email.</span>")
      ).toBeNull();
    });
  });
});
