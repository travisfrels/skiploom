import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ButtonLink from './ButtonLink';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ButtonLink', () => {
  it('renders children', () => {
    renderWithRouter(<ButtonLink variant="primary" to="/test">Go</ButtonLink>);
    expect(screen.getByText('Go')).toBeInTheDocument();
  });

  it('renders as a link with correct href', () => {
    renderWithRouter(<ButtonLink variant="primary" to="/recipes/new">Add</ButtonLink>);
    expect(screen.getByRole('link', { name: 'Add' })).toHaveAttribute('href', '/recipes/new');
  });

  it('renders primary variant', () => {
    renderWithRouter(<ButtonLink variant="primary" to="/test">Primary</ButtonLink>);
    const link = screen.getByRole('link', { name: 'Primary' });
    expect(link.className).toContain('bg-blue-600');
  });

  it('renders secondary variant', () => {
    renderWithRouter(<ButtonLink variant="secondary" to="/test">Secondary</ButtonLink>);
    const link = screen.getByRole('link', { name: 'Secondary' });
    expect(link.className).toContain('bg-slate-200');
  });
});
