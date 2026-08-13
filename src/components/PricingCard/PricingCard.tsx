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
  /** Plan name (e.g. Candidat Pro). */
  title: string;
  /** Short plan description shown under the title. */
  description: string;
  /** Display price string; use "Gratuit" or "Sur devis" to hide the period suffix. */
  price: string;
  /** Billing period suffix displayed next to the price. */
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
}

export const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      title,
      description,
      price,
      period = '/ mois',
      features,
      isPopular = false,
      buttonText = 'Commencer',
      buttonVariant,
      onSelect,
      badgeText = 'Le plus populaire',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex flex-col p-6 rounded-2xl transition-all duration-200 bg-white border',
          isPopular
            ? 'border-ai-500 shadow-md ring-1 ring-ai-500'
            : 'border-slate-200 hover:border-slate-300 shadow-sm',
          className
        )}
        {...props}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-ai-600 to-brand-600 text-white text-[11px] font-semibold rounded-full shadow-sm flex items-center space-x-1">
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            <span>{badgeText}</span>
          </div>
        )}

        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{description}</p>
        </div>

        <div className="flex items-baseline mb-6">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{price}</span>
          {price !== 'Gratuit' && price !== 'Sur devis' && (
            <span className="text-xs font-medium text-slate-500 ml-1">{period}</span>
          )}
        </div>

        <ul className="space-y-3 mb-8 flex-1" aria-label={`Fonctionnalités du plan ${title}`}>
          {features.map((feature) => (
            <li key={feature.text} className="flex items-start text-xs">
              <div
                className={cn(
                  'p-0.5 rounded-full mr-2.5 mt-0.5 flex-shrink-0',
                  feature.included ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                )}
                aria-hidden="true"
              >
                <Check className="w-3 h-3" />
              </div>
              <span className={feature.included ? 'text-slate-700' : cn(mutedTextClass, 'line-through')}>
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
