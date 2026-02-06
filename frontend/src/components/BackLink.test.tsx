import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BackLink from './BackLink';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('BackLink', () => {
  it('renders children text', () => {
    renderWithRouter(<BackLink to="/recipes">Back to Recipes</BackLink>);
    expect(screen.getByText('Back to Recipes')).toBeInTheDocument();
  });

  it('renders as a link with correct href', () => {
    renderWithRouter(<BackLink to="/recipes">Back to Recipes</BackLink>);
    expect(screen.getByRole('link', { name: /Back to Recipes/ })).toHaveAttribute('href', '/recipes');
  });

  it('renders back arrow icon', () => {
    renderWithRouter(<BackLink to="/test">Back</BackLink>);
    const link = screen.getByRole('link', { name: /Back/ });
    const svg = link.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
