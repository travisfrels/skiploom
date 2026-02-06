import { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import * as act from '../store/actions';

function Layout() {
  const error = useAppSelector((state) => state.recipes.error);
  const success = useAppSelector((state) => state.recipes.success);

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => act.setSuccess(null), 4000);
    return () => clearTimeout(timer);
  }, [success]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-800 text-white shadow-md">
        <div className="px-8 py-4">
          <h1 className="text-3xl font-bold mb-4">Skiploom</h1>
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
          </nav>
        </div>
      </header>
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-8 py-3">
          <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => act.setError(null)}
              className="text-red-400 hover:text-red-600 ml-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-b border-green-200 px-8 py-3">
          <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
            <p className="text-sm text-green-600">{success}</p>
            <button
              onClick={() => act.setSuccess(null)}
              className="text-green-400 hover:text-green-600 ml-4"
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
