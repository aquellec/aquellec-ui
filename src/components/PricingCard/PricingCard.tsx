import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '../Button';
import { cn } from '../../lib/cn';
import { mutedTextClass } from '../../lib/semantic-colors';

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
          'relative flex flex-col p-6 rounded-card transition-all duration-200 bg-white border',
          'dark:bg-neutral-900',
          isPopular
            ? 'border-ai-500 shadow-md ring-1 ring-ai-500 dark:border-ai-400 dark:ring-ai-400'
            : 'border-neutral-200 hover:border-neutral-300 shadow-xs dark:border-neutral-700 dark:hover:border-neutral-600',
          className
        )}
        {...props}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-ai-600 to-brand-600 text-white text-caption font-semibold rounded-full shadow-xs flex items-center space-x-1">
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            <span>{badgeText}</span>
          </div>
        )}

        <div className="mb-5">
          <h3 className="text-title font-bold text-neutral-800 dark:text-neutral-100">{title}</h3>
          <p className="text-caption text-neutral-500 dark:text-neutral-400 mt-1 min-h-[32px]">{description}</p>
        </div>

        <div className="flex items-baseline mb-6">
          <span className="text-display font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
            {price}
          </span>
          {/* Rendered only when a period is provided: no magic value to compare
              the price against, which would tie the component to one language. */}
          {period && (
            <span className="text-caption font-medium text-neutral-500 dark:text-neutral-400 ml-1">{period}</span>
          )}
        </div>

        <ul className="space-y-3 mb-8 flex-1" aria-label={featuresLabel(title)}>
          {features.map((feature) => (
            <li key={feature.text} className="flex items-start text-caption">
              <span className="sr-only">{feature.included ? includedLabel : excludedLabel}</span>
              <div
                className={cn(
                  'p-0.5 rounded-full mr-2.5 mt-0.5 flex-shrink-0',
                  feature.included
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                    : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                )}
                aria-hidden="true"
              >
                <Check className="w-3 h-3" />
              </div>
              <span
                className={
                  feature.included
                    ? 'text-neutral-700 dark:text-neutral-200'
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
