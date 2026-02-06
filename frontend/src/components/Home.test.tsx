import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home', () => {
  it('renders welcome message', () => {
    render(<Home />);
    expect(screen.getByText('Welcome to Skiploom')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<Home />);
    expect(screen.getByText('Your family recipe tracker')).toBeInTheDocument();
  });
});
