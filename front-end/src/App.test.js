import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the login screen when signed out", () => {
  localStorage.clear();
  render(<App />);

  expect(
    screen.getByRole("heading", { name: /welcome back/i })
  ).toBeInTheDocument();
});
