import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders dashboard page', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  const headingElement = screen.getByText(/Welcome to Invoice Pro/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders settings page', () => {
  render(
    <MemoryRouter initialEntries={['/settings']}>
      <App />
    </MemoryRouter>
  );
  const headingElement = screen.getByText(/Company Profile/i);
  expect(headingElement).toBeInTheDocument();
});
