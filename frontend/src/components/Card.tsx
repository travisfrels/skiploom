import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`.trim()}>
      {children}
    </div>
  );
}

export default Card;
