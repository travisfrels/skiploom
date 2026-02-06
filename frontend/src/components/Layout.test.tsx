import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import { renderWithProviders } from '../test/testUtils';

describe('Layout', () => {
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
});
