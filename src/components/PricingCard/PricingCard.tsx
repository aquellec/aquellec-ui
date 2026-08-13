import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '../Button';

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period?: string;
  features: PricingFeature[];
  isPopular?: boolean;
  buttonText?: string;
  buttonVariant?: 'primary' | 'ai' | 'outline';
  onSelect?: () => void;
  badgeText?: string;
  className?: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
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
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'relative flex flex-col p-6 rounded-2xl transition-all duration-200 bg-white border',
          isPopular
            ? 'border-ai-500 shadow-md ring-1 ring-ai-500'
            : 'border-slate-200 hover:border-slate-300 shadow-xs',
          className
        )
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-ai-600 to-brand-600 text-white text-[11px] font-semibold rounded-full shadow-xs flex items-center space-x-1">
          <Sparkles className="w-3 h-3" />
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

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start text-xs">
            <div
              className={clsx(
                'p-0.5 rounded-full mr-2.5 mt-0.5 flex-shrink-0',
                feature.included ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'
              )}
            >
              <Check className="w-3 h-3" />
            </div>
            <span className={feature.included ? 'text-slate-700' : 'text-slate-400 line-through'}>
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
};
