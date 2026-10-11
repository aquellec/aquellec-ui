import React from 'react';
import { Check, X, AlertTriangle, Sparkles } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color scheme reflecting ATS semantic meaning. */
  variant?: 'success' | 'danger' | 'warning' | 'neutral' | 'ai';
  /** Compact or default padding preset. */
  size?: 'sm' | 'md';
  /** Optional leading icon illustrating the badge meaning. */
  icon?: 'check' | 'cross' | 'warning' | 'ai' | 'none';
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'neutral',
      size = 'md',
      icon = 'none',
      children,
      className,
      ...props
    },
    ref
  ) => {
    /*
      Status has to be readable in one pass down a column of forty rows, so the
      three semantic variants are solid rather than tinted. A `-700` fill under
      white type sits between 7:1 and 9:1 in light mode and inverts to a `-400`
      fill under near-black in dark — decisive at a glance, and legible to
      someone who cannot separate the hues at all, because the weight and the
      word carry it too.

      There is no outline and no leading bar. A filled rectangle with a line
      around it states the same fact twice, and the bar was the accent that made
      four colours compete on one page.

      `ai` is tonal cobalt rather than a fourth status colour: a machine's
      contribution is not a verdict, so it is marked at low emphasis in the one
      brand hue. It was solid black for a pass, which made an advisory tag the
      heaviest thing on the card it sat in.
    */
    const variants = {
      success: 'bg-moss-700 text-white dark:bg-moss-400 dark:text-ink-950',
      danger: 'bg-brick-700 text-white dark:bg-brick-400 dark:text-ink-950',
      warning: 'bg-ochre-700 text-white dark:bg-ochre-400 dark:text-ink-950',
      neutral: 'bg-ink-100 text-ink-800 dark:bg-ink-800 dark:text-ink-100',
      ai: 'bg-brand-100 text-brand-900 dark:bg-brand-500/20 dark:text-brand-100',
    };

    /*
      Fixed heights rather than vertical padding: a badge sits inside a table
      cell next to other badges, and a row whose chips are two pixels apart in
      height reads as sloppy from across the room. The horizontal padding is
      optical — a hair tighter when an icon is present, because the icon already
      carries its own visual gap.
    */
    const sizes = {
      sm: 'h-5 text-xs px-2 gap-1',
      md: 'h-6 text-xs px-2.5 gap-1.5',
    };

    const iconSizes = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

    /*
      The icon takes the badge's own foreground. On a solid fill a separately
      coloured icon is either invisible or a second accent, and this system has
      exactly one.
    */
    const renderIcon = () => {
      switch (icon) {
        case 'check':
          return <Check className={iconSizes} aria-hidden="true" />;
        case 'cross':
          return <X className={iconSizes} aria-hidden="true" />;
        case 'warning':
          return <AlertTriangle className={iconSizes} aria-hidden="true" />;
        case 'ai':
          return <Sparkles className={iconSizes} aria-hidden="true" />;
        default:
          return null;
      }
    };

    return (
      <span
        ref={ref}
        className={cn(
          /*
            `whitespace-nowrap`: a status badge is a label, never a paragraph.
            In a narrow table cell it would otherwise wrap and get clipped.
          */
          'inline-flex items-center whitespace-nowrap rounded-md font-semibold uppercase tracking-wide',
          'transition-colors duration-150 ease-settle motion-reduce:transition-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {renderIcon()}
        <span>{children}</span>
      </span>
    );
  }
);

Badge.displayName = 'Badge';
