import React from 'react';
import { cn } from '../../lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Surface style preset for the card container. */
  variant?: 'default' | 'outline' | 'ai' | 'ghost';
  children: React.ReactNode;
}

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Primary card heading. */
  title?: React.ReactNode;
  /** Secondary descriptive text below the title. */
  subtitle?: React.ReactNode;
  /** Optional action element aligned to the right (e.g. badge, menu). */
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between pb-4 border-b border-slate-100', className)}
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
  }
);

CardHeader.displayName = 'CardHeader';

export const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('py-4', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', children, className, ...props }, ref) => {
    const variants = {
      default: 'bg-white border border-slate-200/80 shadow-sm hover:shadow-md',
      outline: 'bg-transparent border border-slate-300',
      ai: 'bg-gradient-to-br from-ai-50/50 via-white to-brand-50/30 border border-ai-200/70 shadow-sm',
      ghost: 'bg-slate-50/80 border border-transparent',
    };

    return (
      <div
        ref={ref}
        className={cn('rounded-2xl p-5 transition-all duration-200', variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
) as React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
};

Card.displayName = 'Card';
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
