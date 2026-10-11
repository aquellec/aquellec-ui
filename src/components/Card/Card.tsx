import React, { createContext, useContext, useEffect, useId, useState } from 'react';
import { cn } from '../../lib/cn';
import { resolveSectionHeading, type SectionHeadingElement } from '../../lib/heading';
import { mastheadRuleClass } from '../../lib/mark';
import {
  dividerBorderClass,
  mutedTextClass,
  raisedSurfaceClass,
  strongTextClass,
  sunkenSurfaceClass,
} from '../../lib/semantic-colors';

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
        className={cn('relative flex items-center justify-between pb-4', className)}
        {...props}
      >
        {/*
          A hairline under the header, and nothing heavier. The card has no
          outline of its own; what separates the header from the body is this
          line plus the space either side of it.
        */}
        <span className={cn('absolute inset-x-0 bottom-0', mastheadRuleClass)} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          {title && (
            <TitleElement
              id={resolvedTitleId}
              className={cn('text-lg font-semibold tracking-tight', strongTextClass)}
            >
              {title}
            </TitleElement>
          )}
          {subtitle && (
            <p className={cn('mt-0.5 text-xs', mutedTextClass)}>{subtitle}</p>
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
          'flex items-center justify-between border-t pt-4 text-xs',
          dividerBorderClass,
          mutedTextClass,
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

    /*
      Elevation, not outlines.

      `default` is a white sheet on a white page, told apart by a shadow and by
      the space around it, and lifts one step up the ladder on hover. `outline`
      keeps a 2px border because being drawn is its entire job. `ghost` sits on
      the sunken surface, with no shadow.
    */
    const variants = {
      default: cn(raisedSurfaceClass, 'shadow-card hover:shadow-raised'),
      outline: cn(
        'border-2 bg-transparent border-ink-900 dark:border-ink-100'
      ),
      /*
        The AI card is emphasised by elevation, not by an accent. It sits one
        step up the ladder from `default` and nothing else about it is coloured:
        what identifies it as machine-written is the content placed in it —
        typically an `ai` badge and an `ai` action — which says so in words.
      */
      ai: cn(raisedSurfaceClass, 'shadow-raised'),
      ghost: cn(sunkenSurfaceClass),
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
            'rounded-2xl p-5 transition-all duration-150 ease-settle motion-reduce:transition-none sm:p-6',
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
