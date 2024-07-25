import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "../pages";
import { screen, fireEvent, waitFor } from "@testing-library/dom";
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));
//render the login page and the label from document
describe("LoginPage", () => {
  it("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getAllByText(/login/i)).toHaveLength(2);
  });

  it("calls API and redirects on successful login", async () => {
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "mock-token" }),
    });
    global.fetch = mockFetch as any;
    //render page and call api and redirect page on successful login
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "emilys" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "emilyspass" },
    });
    // Use getByRole to target the button
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
    expect(mockRouter.push).toHaveBeenCalledWith("/products");
  });

  //handle errors on login
  it("handles login errors", async () => {
    const mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Login failed" }),
    });
    global.fetch = mockFetch as any;

    //render page and calls the api to login
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "emilys" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "emilyspass" },
    });
    // getByRole to target the button
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));
  });
});
