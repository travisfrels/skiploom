import type { ButtonHTMLAttributes } from 'react';

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white',
  secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800',
  danger: 'bg-red-100 hover:bg-red-200 text-red-700',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: keyof typeof variantClasses;
}

function Button({ variant, className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`${variantClasses[variant]} px-4 py-2 rounded-lg font-medium transition-colors ${className}`.trim()}
      {...props}
    />
  );
}

export default Button;
