import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface BackLinkProps {
  to: string;
  children: ReactNode;
}

function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link
      to={to}
      className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {children}
    </Link>
  );
}

export default BackLink;
