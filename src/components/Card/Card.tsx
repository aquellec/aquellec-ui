import React, { createContext, useContext, useEffect, useId, useState } from 'react';
import { cn } from '../../lib/cn';
import { resolveSectionHeading, type SectionHeadingElement } from '../../lib/heading';

const CardTitleContext = createContext<{
  setTitleId: (id: string | undefined) => void;
} | null>(null);

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Surface style preset for the card container. */
  variant?: 'default' | 'outline' | 'ai' | 'ghost';
  /** ID referencing the card title for `aria-labelledby`. Overrides auto-detected header title id. */
  labelledBy?: string;
  children: React.ReactNode;
}

type CardTitleElement = SectionHeadingElement;

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Primary card heading. */
  title?: React.ReactNode;
  /** ID applied to the title element and registered on the parent `Card` for `aria-labelledby`. */
  titleId?: string;
  /** Semantic element used to render `title`. Defaults to `h2` for plain text, `div` for complex nodes. */
  titleAs?: CardTitleElement;
  /** Secondary descriptive text below the title. */
  subtitle?: React.ReactNode;
  /** Optional action element aligned to the right (e.g. badge, menu). */
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, titleId, titleAs, subtitle, action, children, className, ...props }, ref) => {
    const generatedTitleId = useId();
    const resolvedTitleId = titleId ?? generatedTitleId;
    const TitleElement = resolveSectionHeading(title, titleAs);
    const cardTitleContext = useContext(CardTitleContext);

    useEffect(() => {
      if (!title || !cardTitleContext) return;
      cardTitleContext.setTitleId(resolvedTitleId);
      return () => cardTitleContext.setTitleId(undefined);
    }, [title, resolvedTitleId, cardTitleContext]);

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between pb-4 border-b border-slate-100', className)}
        {...props}
      >
        <div className="flex-1 min-w-0">
          {title && (
            <TitleElement id={resolvedTitleId} className="text-base font-semibold text-slate-800">
              {title}
            </TitleElement>
          )}
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
  ({ variant = 'default', labelledBy, children, className, ...props }, ref) => {
    const [headerTitleId, setHeaderTitleId] = useState<string>();
    const ariaLabelledBy = labelledBy ?? headerTitleId;

    const variants = {
      /*
        Solid border rather than 80% alpha: on the `slate-50` page background of
        the dashboards, a translucent border almost disappears at 375px, where
        the card outline is the only thing separating two sections.
      */
      default: 'bg-white border border-slate-200 shadow-card hover:shadow-md',
      outline: 'bg-transparent border border-slate-300',
      ai: 'bg-gradient-to-br from-ai-50/50 via-white to-brand-50/30 border border-ai-200/70 shadow-card',
      ghost: 'bg-slate-50/80 border border-transparent',
    };

    return (
      <CardTitleContext.Provider value={{ setTitleId: setHeaderTitleId }}>
        <div
          ref={ref}
          aria-labelledby={ariaLabelledBy}
          /*
            Tighter padding below `sm`: at 375px, 20px on each side eats 11% of
            the screen. Desktop spacing is unchanged.
          */
          className={cn(
            'rounded-2xl p-4 sm:p-5 transition-all duration-200',
            variants[variant],
            className
          )}
          {...props}
        >
          {children}
        </div>
      </CardTitleContext.Provider>
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
