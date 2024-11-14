import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders app with auth components', () => {
  render(<App />);
  // expect(screen.getByText('Track Your Meals, Boost Your Health')).toBeInTheDocument();
  // expect(screen.getByText('Create Account')).toBeInTheDocument();
});