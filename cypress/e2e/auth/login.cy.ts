describe("Log In", () => {
  const user = cy;
  it("should see login page", () => {
    user.visit("/").title().should("eq", "Login | Nuber Eats");
  });
  it("can see email / password validation errors", () => {
    user.visit("/");
    user.findByPlaceholderText(/email/i).type("invalid-email");
    user.findByRole("alert").should("have.text", "Please enter a valid email");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("valid@email.com");
    user
      .findByPlaceholderText(/password/i)
      .type("1234")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });
  it("can fill out the form and log in", () => {
    user.login("valid@email.com", "1234");
  });
});
