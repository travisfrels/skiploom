import { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useColorScheme } from '../hooks/useColorScheme';
import * as act from '../store/actions';

function Layout() {
  const user = useAppSelector((state) => state.user.user);
  const error = useAppSelector((state) => state.recipes.error ?? state.mealPlan.error ?? state.shoppingList.error);
  const success = useAppSelector((state) => state.recipes.success ?? state.mealPlan.success ?? state.shoppingList.success);
  const colorScheme = useColorScheme();
  const mealPlanningEnabled = useAppSelector(
    (state) => state.featureFlags.featureFlags.MEAL_PLANNING ?? false
  );
  const shoppingListEnabled = useAppSelector(
    (state) => state.featureFlags.featureFlags.SHOPPING_LIST ?? false
  );

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => {
      act.setSuccess(null);
      act.setMealPlanSuccess(null);
      act.setShoppingListSuccess(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [success]);

  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-900 dark:text-slate-100">
      <header className="bg-slate-800 text-white shadow-md">
        <div className="px-8 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Skiploom</h1>
            <div className="flex items-center gap-3">
              {colorScheme === 'dark' ? (
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <title>Dark mode active</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <title>Light mode active</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 7.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
              {user && (
                <span className="text-sm text-slate-300">{user.displayName}</span>
              )}
            </div>
          </div>
          <nav className="flex gap-6">
            <Link
              to="/"
              className="text-lg px-4 py-2 rounded hover:bg-slate-700 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/recipes"
              className="text-lg px-4 py-2 rounded hover:bg-slate-700 transition-colors"
            >
              Recipes
            </Link>
            {mealPlanningEnabled && (
              <Link
                to="/meal-planning"
                className="text-lg px-4 py-2 rounded hover:bg-slate-700 transition-colors"
              >
                Meal Planning
              </Link>
            )}
            {shoppingListEnabled && (
              <Link
                to="/shopping-lists"
                className="text-lg px-4 py-2 rounded hover:bg-slate-700 transition-colors"
              >
                Shopping Lists
              </Link>
            )}
          </nav>
        </div>
      </header>
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-8 py-3">
          <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => { act.setError(null); act.setMealPlanError(null); act.setShoppingListError(null); }}
              className="text-red-400 dark:text-red-300 hover:text-red-600 dark:hover:text-red-400 ml-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 px-8 py-3">
          <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
            <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            <button
              onClick={() => { act.setSuccess(null); act.setMealPlanSuccess(null); act.setShoppingListSuccess(null); }}
              className="text-green-400 dark:text-green-300 hover:text-green-600 dark:hover:text-green-400 ml-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <main className="flex-1 p-8 max-w-6xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
