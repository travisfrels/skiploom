import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>Card content</p></Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies base card classes', () => {
    render(<Card><p>Content</p></Card>);
    const card = screen.getByText('Content').parentElement!;
    expect(card.className).toContain('bg-white');
    expect(card.className).toContain('rounded-lg');
    expect(card.className).toContain('shadow');
    expect(card.className).toContain('p-6');
  });

  it('appends additional className', () => {
    render(<Card className="space-y-4"><p>Content</p></Card>);
    const card = screen.getByText('Content').parentElement!;
    expect(card.className).toContain('space-y-4');
    expect(card.className).toContain('bg-white');
  });
});
