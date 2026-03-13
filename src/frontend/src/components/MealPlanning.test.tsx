import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import MealPlanning from './MealPlanning';
import { renderWithProviders } from '../test/testUtils';
import { getWeekStart, formatDateISO } from '../utils/weekDates';

vi.mock('../operations', () => ({
  loadMealPlanEntries: vi.fn(),
}));

function NavigationTarget() {
  const [searchParams] = useSearchParams();
  return (
    <div data-testid="navigation-target">
      <span data-testid="nav-date">{searchParams.get('date')}</span>
      <span data-testid="nav-mealType">{searchParams.get('mealType')}</span>
    </div>
  );
}

describe('MealPlanning', () => {
  describe('add button navigation', () => {
    it('navigates to entry form with date and mealType when clicking add button', async () => {
      const user = userEvent.setup();
      const weekStart = getWeekStart(new Date());
      const mondayISO = formatDateISO(weekStart);

      renderWithProviders(
        <Routes>
          <Route path="/meal-planning" element={<MealPlanning />} />
          <Route path="/meal-planning/new" element={<NavigationTarget />} />
        </Routes>,
        { initialEntries: ['/meal-planning'] }
      );

      const addButton = screen.getByRole('button', { name: /Add meal for Mon Breakfast/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByTestId('navigation-target')).toBeInTheDocument();
      });
      expect(screen.getByTestId('nav-date')).toHaveTextContent(mondayISO);
      expect(screen.getByTestId('nav-mealType')).toHaveTextContent('BREAKFAST');
    });

    it('passes correct mealType for different meal type rows', async () => {
      const user = userEvent.setup();

      renderWithProviders(
        <Routes>
          <Route path="/meal-planning" element={<MealPlanning />} />
          <Route path="/meal-planning/new" element={<NavigationTarget />} />
        </Routes>,
        { initialEntries: ['/meal-planning'] }
      );

      const addButton = screen.getByRole('button', { name: /Add meal for Mon Dinner/i });
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByTestId('navigation-target')).toBeInTheDocument();
      });
      expect(screen.getByTestId('nav-mealType')).toHaveTextContent('DINNER');
    });

    it('does not add onClick to existing entry buttons', () => {
      const weekStart = getWeekStart(new Date());
      const mondayISO = formatDateISO(weekStart);

      renderWithProviders(
        <Routes>
          <Route path="/meal-planning" element={<MealPlanning />} />
        </Routes>,
        {
          initialEntries: ['/meal-planning'],
          preloadedState: {
            mealPlan: {
              entries: {
                'entry-1': {
                  id: 'entry-1',
                  date: mondayISO,
                  mealType: 'BREAKFAST',
                  title: 'Test Meal',
                  notes: '',
                },
              },
            },
          },
        }
      );

      const entryButton = screen.getByTestId('entry-entry-1');
      expect(entryButton).toBeInTheDocument();
    });
  });
});
