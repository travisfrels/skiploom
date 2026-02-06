import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StepList from './StepList';
import type { Step } from '../types';

const mockSteps: Step[] = [
  { orderIndex: 1, instruction: 'Preheat oven to 350°F' },
  { orderIndex: 2, instruction: 'Mix dry ingredients' },
  { orderIndex: 3, instruction: 'Bake for 30 minutes' },
];

describe('StepList', () => {
  it('renders section title', () => {
    render(<StepList steps={mockSteps} />);
    expect(screen.getByText('Instructions')).toBeInTheDocument();
  });

  it('renders all steps', () => {
    render(<StepList steps={mockSteps} />);
    expect(screen.getByText('Preheat oven to 350°F')).toBeInTheDocument();
    expect(screen.getByText('Mix dry ingredients')).toBeInTheDocument();
    expect(screen.getByText('Bake for 30 minutes')).toBeInTheDocument();
  });

  it('renders step numbers', () => {
    render(<StepList steps={mockSteps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders steps in order by orderIndex', () => {
    const unorderedSteps: Step[] = [
      { orderIndex: 3, instruction: 'Third step' },
      { orderIndex: 1, instruction: 'First step' },
      { orderIndex: 2, instruction: 'Second step' },
    ];
    render(<StepList steps={unorderedSteps} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).toHaveTextContent('First step');
    expect(listItems[1]).toHaveTextContent('Second step');
    expect(listItems[2]).toHaveTextContent('Third step');
  });

  it('renders empty list without errors', () => {
    render(<StepList steps={[]} />);
    expect(screen.getByText('Instructions')).toBeInTheDocument();
  });
});
