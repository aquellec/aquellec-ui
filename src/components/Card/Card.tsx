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
        className={cn(
          'flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800',
          className
        )}
        {...props}
      >
        <div className="flex-1 min-w-0">
          {title && (
            <TitleElement
              id={resolvedTitleId}
              className="text-base font-semibold text-neutral-800 dark:text-neutral-100"
            >
              {title}
            </TitleElement>
          )}
          {subtitle && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{subtitle}</p>
          )}
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
          'pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500',
          'dark:border-neutral-800 dark:text-neutral-400',
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
        Solid border rather than 80% alpha: on the `neutral-50` page background of
        the dashboards, a translucent border almost disappears at 375px, where
        the card outline is the only thing separating two sections.
      */
      default:
        'bg-white border border-neutral-200 shadow-card hover:shadow-md dark:bg-neutral-900 dark:border-neutral-700',
      outline: 'bg-transparent border border-neutral-300 dark:border-neutral-600',
      /*
        The `ai` gradient keeps its diagonal wash in dark mode, at a much lower
        opacity: the tint has to read as a hint of colour on the surface, not
        repaint the card.
      */
      ai: 'bg-gradient-to-br from-ai-50/50 via-white to-brand-50/30 border border-ai-200/70 shadow-card dark:from-ai-500/10 dark:via-neutral-900 dark:to-brand-500/10 dark:border-ai-500/25',
      ghost: 'bg-neutral-50/80 border border-transparent dark:bg-neutral-800/50',
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
