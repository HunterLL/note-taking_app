import { render, screen } from "@testing-library/react";
import NotFound from "../components/NotFound";

test('renders Not Found copy', () => {
  render(<NotFound />);
  const notFoundText = screen.queryByText('Not Found page');
  expect(notFoundText).toBeTruthy();
});