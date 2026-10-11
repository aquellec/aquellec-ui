import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '../Button';
import { cn } from '../../lib/cn';
import { dataFigureClass } from '../../lib/mark';
import { mutedTextClass, raisedSurfaceClass, strongTextClass } from '../../lib/semantic-colors';

export interface PricingFeature {
  /** Feature label displayed in the pricing list. */
  text: string;
  /** Whether the feature is included in the plan. */
  included: boolean;
}

export interface PricingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Plan name (e.g. Growth). */
  title: string;
  /** Short plan description shown under the title. */
  description: string;
  /** Display price string, already formatted (e.g. "$9", "Free", "Custom"). */
  price: string;
  /**
   * Billing period suffix shown next to the price. Omit it for plans that have
   * no recurring price, such as a free or quote-based tier.
   */
  period?: string;
  /** List of plan features with inclusion state. */
  features: PricingFeature[];
  /** Highlights the card with a recommended badge and accent border. */
  isPopular?: boolean;
  /** CTA button label. */
  buttonText?: string;
  /** Overrides the default CTA button variant. */
  buttonVariant?: 'primary' | 'ai' | 'outline';
  /** Called when the plan CTA is clicked. */
  onSelect?: () => void;
  /** Text displayed in the popular badge. */
  badgeText?: string;
  /** `sr-only` prefix announced before an included feature. */
  includedLabel?: string;
  /** `sr-only` prefix announced before an excluded feature. */
  excludedLabel?: string;
  /** Accessible name of the feature list. Receives the plan title. */
  featuresLabel?: (planTitle: string) => string;
}

export const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      title,
      description,
      price,
      period,
      features,
      isPopular = false,
      buttonText = 'Get started',
      buttonVariant,
      onSelect,
      badgeText = 'Most popular',
      includedLabel = 'Included: ',
      excludedLabel = 'Not included: ',
      featuresLabel = (planTitle) => `${planTitle} plan features`,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex flex-col rounded-2xl p-6',
          'transition-all duration-150 ease-settle motion-reduce:transition-none',
          raisedSurfaceClass,
          /*
            The recommended plan is one step up the elevation ladder and wears
            the AI mark — not a second, brighter card in a different visual
            language. Everything else on the row stays put.
          */
          /*
            The recommended plan is one step up the elevation ladder and wears
            the brand tag. Emphasis is elevation plus the one brand hue — never
            a second accent invented for the occasion.
          */
          isPopular ? 'shadow-raised' : 'shadow-card hover:shadow-raised',
          className
        )}
        {...props}
      >
        {isPopular && (
          /*
            A solid tag, squared like every other label in the system, sitting on
            the card's top edge rather than a gradient pill floating above it.
          */
          <div className="absolute -top-3 left-6 flex items-center gap-1.5 rounded-md bg-brand-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-eyebrow text-white shadow-xs dark:bg-brand-500">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            <span>{badgeText}</span>
          </div>
        )}

        <div className="mb-5">
          <h3 className={cn('text-xl font-semibold tracking-tight', strongTextClass)}>{title}</h3>
          <p className={cn('mt-1 min-h-[32px] text-xs', mutedTextClass)}>{description}</p>
        </div>

        <div className="flex items-baseline mb-6">
          <span
            className={cn(
              'aq-display font-display text-6xl font-bold tracking-masthead',
              dataFigureClass,
              strongTextClass
            )}
          >
            {price}
          </span>
          {/* Rendered only when a period is provided: no magic value to compare
              the price against, which would tie the component to one language. */}
          {period && (
            <span className={cn('ml-1.5 text-xs font-medium', mutedTextClass)}>{period}</span>
          )}
        </div>

        <ul className="space-y-3 mb-8 flex-1" aria-label={featuresLabel(title)}>
          {features.map((feature) => (
            <li key={feature.text} className="flex items-start text-xs">
              <span className="sr-only">{feature.included ? includedLabel : excludedLabel}</span>
              <div
                className={cn(
                  'p-0.5 rounded-full mr-2.5 mt-0.5 flex-shrink-0',
                  feature.included
                    ? 'bg-moss-100 text-moss-800 dark:bg-moss-500/15 dark:text-moss-300'
                    : 'bg-ink-200 text-ink-600 dark:bg-ink-800 dark:text-ink-300'
                )}
                aria-hidden="true"
              >
                <Check className="w-3 h-3" />
              </div>
              <span
                className={
                  feature.included
                    ? 'text-ink-800 dark:text-ink-100'
                    : cn(mutedTextClass, 'line-through')
                }
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        <Button
          variant={buttonVariant || (isPopular ? 'ai' : 'outline')}
          onClick={onSelect}
          className="w-full"
        >
          {buttonText}
        </Button>
      </div>
    );
  }
);

PricingCard.displayName = 'PricingCard';
