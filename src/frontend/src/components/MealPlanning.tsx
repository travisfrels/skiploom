import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { getWeekStart, formatDateISO } from '../utils/weekDates';
import type { MealType } from '../types';
import * as ops from '../operations';

const MEAL_TYPES: MealType[] = ['BREAKFAST', 'BRUNCH', 'LUNCH', 'DINNER', 'SNACK'];

const MEAL_TYPE_LABELS: Record<MealType, string> = {
  BREAKFAST: 'Breakfast',
  BRUNCH: 'Brunch',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SNACK: 'Snack',
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' });
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const year = weekEnd.getFullYear();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} – ${endDay}, ${year}`;
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
}

function MealPlanning() {
  const navigate = useNavigate();
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const entries = useAppSelector((state) => state.mealPlan.entries);
  const loading = useAppSelector((state) => state.mealPlan.loading);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return {
        label: DAY_LABELS[i],
        date: day,
        iso: formatDateISO(day),
      };
    });
  }, [weekStart]);

  const todayISO = formatDateISO(new Date());

  useEffect(() => {
    const startDate = formatDateISO(weekStart);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const endDate = formatDateISO(weekEnd);
    ops.loadMealPlanEntries({ startDate, endDate });
  }, [weekStart]);

  const entryList = Object.values(entries);

  function goToPreviousWeek() {
    setWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() - 7);
      return next;
    });
  }

  function goToNextWeek() {
    setWeekStart((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + 7);
      return next;
    });
  }

  function goToToday() {
    setWeekStart(getWeekStart(new Date()));
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Meal Planning
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousWeek}
            className="px-3 py-1.5 text-sm rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition-colors"
            aria-label="Previous week"
          >
            &larr; Prev
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Today
          </button>
          <button
            onClick={goToNextWeek}
            className="px-3 py-1.5 text-sm rounded bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition-colors"
            aria-label="Next week"
          >
            Next &rarr;
          </button>
        </div>
      </div>

      <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4" data-testid="week-range">
        {formatWeekRange(weekStart)}
      </p>

      {loading ? (
        <p className="text-slate-500 dark:text-slate-400">Loading meal plan...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" data-testid="meal-plan-grid">
            <thead>
              <tr>
                <th className="p-2 text-left text-sm font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 w-24">
                </th>
                {weekDays.map((day) => (
                  <th
                    key={day.iso}
                    className={`p-2 text-center text-sm font-medium border-b border-slate-200 dark:border-slate-700 ${
                      day.iso === todayISO
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <div>{day.label}</div>
                    <div className="text-xs">{day.date.getMonth() + 1}/{day.date.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEAL_TYPES.map((mealType) => (
                <tr key={mealType}>
                  <td className="p-2 text-sm font-medium text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">
                    {MEAL_TYPE_LABELS[mealType]}
                  </td>
                  {weekDays.map((day) => {
                    const cellEntries = entryList.filter(
                      (e) => e.date === day.iso && e.mealType === mealType
                    );
                    return (
                      <td
                        key={day.iso}
                        className={`p-2 border-b border-slate-200 dark:border-slate-700 align-top min-w-[120px] ${
                          day.iso === todayISO
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : ''
                        }`}
                        data-testid={`cell-${day.iso}-${mealType}`}
                      >
                        {cellEntries.length > 0 ? (
                          cellEntries.map((entry) => (
                            <button
                              key={entry.id}
                              className="block w-full text-left text-sm px-2 py-1 mb-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors cursor-pointer truncate"
                              data-testid={`entry-${entry.id}`}
                            >
                              {entry.title}
                            </button>
                          ))
                        ) : (
                          <button
                            onClick={() => navigate(`/meal-planning/new?date=${day.iso}&mealType=${mealType}`)}
                            className="w-full h-8 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            aria-label={`Add meal for ${day.label} ${MEAL_TYPE_LABELS[mealType]}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MealPlanning;
