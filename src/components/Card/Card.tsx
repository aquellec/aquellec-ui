import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'ai' | 'ghost';
  children: React.ReactNode;
}

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge('flex items-center justify-between pb-4 border-b border-slate-100', className)}
      {...props}
    >
      <div>
        {title && <h3 className="text-base font-semibold text-slate-800">{title}</h3>}
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  );
};

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={twMerge('py-4', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge('pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
} = ({ variant = 'default', children, className, ...props }) => {
  const baseStyles = 'rounded-2xl p-5 transition-all duration-200';

  const variants = {
    default: 'bg-white border border-slate-200/80 shadow-xs hover:shadow-sm',
    outline: 'bg-transparent border border-slate-300',
    ai: 'bg-gradient-to-br from-ai-50/50 via-white to-brand-50/30 border border-ai-200/70 shadow-xs',
    ghost: 'bg-slate-50/80 border border-transparent',
  };

  return (
    <div className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
