import React from "react";
import { CREATE_ACCOUNT_MUTATION, CreateAccount } from "../create-account";
import { ApolloProvider } from "@apollo/client";
import { MockApolloClient, createMockClient } from "mock-apollo-client";
import { render, waitFor, RenderResult, screen } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../__generated__/graphql";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
  // 실제 module을 가져옴
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

describe("<CreateAccount />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });
  it("renders OK", async () => {
    await waitFor(() =>
      expect(document.title).toBe("Create Account | Nuber Eats")
    );
  });
  it("renders validation errors", async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole("button");
    userEvent.type(email, "wont@work");
    await waitFor(() => {
      expect(
        screen.queryByText(/Please enter a valid email/i)
      ).toBeInTheDocument();
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Please enter a valid email/i);

    userEvent.clear(email);
    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).toBeInTheDocument();
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/email is required/i);

    userEvent.type(email, "working@email.com");
    userEvent.click(button);
    await waitFor(() => {
      expect(screen.queryByText(/password is required/i)).toBeInTheDocument();
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });
  it("submits mutation with form values", async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole("button");
    const formData = {
      email: "working@mail.com",
      password: "1234",
      role: UserRole.Client,
    };
    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "mutation-error",
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse
    );
    jest.spyOn(window, "alert").mockImplementation(() => null);
    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    userEvent.click(button);
    await waitFor(() => {
      expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
      expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
        createAccountInput: {
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
      });
    });
    const mutationError = screen.getByRole("alert");
    expect(mockPush).toHaveBeenCalledWith("/");
    expect(mutationError).toHaveTextContent("mutation-error");
    expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!");
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
});
