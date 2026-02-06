import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders primary variant', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button', { name: 'Primary' });
    expect(button.className).toContain('bg-blue-600');
  });

  it('renders secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: 'Secondary' });
    expect(button.className).toContain('bg-slate-200');
  });

  it('renders danger variant', () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole('button', { name: 'Danger' });
    expect(button.className).toContain('bg-red-100');
  });

  it('defaults to type="button"', () => {
    render(<Button variant="primary">Default</Button>);
    expect(screen.getByRole('button', { name: 'Default' })).toHaveAttribute('type', 'button');
  });

  it('allows type override to submit', () => {
    render(<Button variant="primary" type="submit">Submit</Button>);
    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(<Button variant="primary" onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button', { name: 'Click' }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('supports disabled state', () => {
    render(<Button variant="primary" disabled>Disabled</Button>);
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
  });
});
