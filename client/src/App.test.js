import { render, screen } from '@testing-library/react';
import App from './App';

test('renders settings page', () => {
  render(<App />);
  const headingElement = screen.getByText(/Company Profile/i);
  expect(headingElement).toBeInTheDocument();
});
