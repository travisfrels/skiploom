import { Link, Outlet } from 'react-router-dom';

function Layout() {
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
      <main className="flex-1 p-8 max-w-6xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
