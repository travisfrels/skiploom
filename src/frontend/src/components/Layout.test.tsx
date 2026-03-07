import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import { renderWithProviders } from '../test/testUtils';

const originalMatchMedia = window.matchMedia;

function mockMatchMedia(prefersDark: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: prefersDark,
    media: '(prefers-color-scheme: dark)',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
}

describe('Layout', () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('renders the Skiploom header', () => {
    renderWithProviders(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Page</div>} />
        </Route>
      </Routes>,
    );
    expect(screen.getByText('Skiploom')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithProviders(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Page</div>} />
        </Route>
      </Routes>,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Recipes')).toBeInTheDocument();
  });

  it('has correct navigation hrefs', () => {
    renderWithProviders(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Page</div>} />
        </Route>
      </Routes>,
    );
    const homeLink = screen.getByText('Home').closest('a');
    const recipesLink = screen.getByText('Recipes').closest('a');

    expect(homeLink).toHaveAttribute('href', '/');
    expect(recipesLink).toHaveAttribute('href', '/recipes');
  });

  it('renders error banner when error state is set', () => {
    renderWithProviders(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Page</div>} />
        </Route>
      </Routes>,
      {
        preloadedState: { recipes: { error: 'Something went wrong' } },
      }
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('does not render error banner when error state is null', () => {
    renderWithProviders(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Page</div>} />
        </Route>
      </Routes>,
    );
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('displays authenticated user name in header', () => {
    renderWithProviders(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Page</div>} />
        </Route>
      </Routes>,
      {
        preloadedState: {
          user: { user: { id: 'user-1', email: 'test@example.com', displayName: 'Test User' } },
        },
      }
    );
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('does not display user name when not authenticated', () => {
    renderWithProviders(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Page</div>} />
        </Route>
      </Routes>,
    );
    expect(screen.queryByText('Test User')).not.toBeInTheDocument();
  });

  it('renders sun icon when OS prefers light color scheme', () => {
    mockMatchMedia(false);
    renderWithProviders(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Page</div>} />
        </Route>
      </Routes>,
    );
    expect(screen.getByTitle('Light mode active')).toBeInTheDocument();
  });

  it('renders moon icon when OS prefers dark color scheme', () => {
    mockMatchMedia(true);
    renderWithProviders(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Page</div>} />
        </Route>
      </Routes>,
    );
    expect(screen.getByTitle('Dark mode active')).toBeInTheDocument();
  });

  it('renders error banner when meal plan error state is set', () => {
    renderWithProviders(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Page</div>} />
        </Route>
      </Routes>,
      {
        preloadedState: { mealPlan: { error: 'Meal plan error occurred' } },
      }
    );
    expect(screen.getByText('Meal plan error occurred')).toBeInTheDocument();
  });

  it('renders success banner when meal plan success state is set', () => {
    renderWithProviders(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Page</div>} />
        </Route>
      </Routes>,
      {
        preloadedState: { mealPlan: { success: 'Entry created successfully' } },
      }
    );
    expect(screen.getByText('Entry created successfully')).toBeInTheDocument();
  });
});
