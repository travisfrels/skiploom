import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800',
} as const;

interface ButtonLinkProps {
  variant: keyof typeof variantClasses;
  to: string;
  children: ReactNode;
}

function ButtonLink({ variant, to, children }: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={`${variantClasses[variant]} px-4 py-2 rounded-lg font-medium transition-colors`}
    >
      {children}
    </Link>
  );
}

export default ButtonLink;
