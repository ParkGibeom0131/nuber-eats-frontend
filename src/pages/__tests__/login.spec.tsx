import { screen } from "@testing-library/react";
import React from "react";
import { LOGIN_MUTATION, Login } from "../login";
import { ApolloProvider } from "@apollo/client";
import { MockApolloClient, createMockClient } from "mock-apollo-client";
import userEvent from "@testing-library/user-event";
import { render, waitFor, RenderResult } from "../../test-utils";

describe("<Login />", () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      );
    });
  });
  it("should renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats");
    });
  });
  it("displays email validation errors", async () => {
    const { getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    // implementation call인 change event를 직접 할 필요가 없음
    userEvent.type(email, "this@wont");
    await waitFor(() => {
      expect(
        screen.queryByText("Please enter a valid email")
      ).toBeInTheDocument();
    });

    let errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent("Please enter a valid email");
    userEvent.clear(email);
    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).toBeInTheDocument();
    });
    errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });
  it("display password required errors", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const submitBtn = getByRole("button");
    userEvent.type(email, "this@wont.com");
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.queryByText(/password is required/i)).toBeInTheDocument();
    });
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });
  it("submits form and calls mutation", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole("button");
    const formData = {
      email: "real@test.com",
      password: "1234",
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "xxx",
          // 해당 경우는 생길 수 없는 상황임, 약간의 편법
          error: "mutation-error",
        },
      },
    });
    // function 안에 function이 있을 경우 즉, implementation을 테스트할 수 없음
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    jest.spyOn(Storage.prototype, "setItem");
    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
      expect(mockedMutationResponse).toHaveBeenCalledWith({
        loginInput: {
          email: formData.email,
          password: formData.password,
        },
      });
    });
    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent("mutation-error");
    expect(localStorage.setItem).toHaveBeenCalledWith("nuber-token", "xxx");
  });
});
