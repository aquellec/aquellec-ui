import React from 'react';
import { User, Briefcase } from 'lucide-react';
import { cn } from '../../lib/cn';
import { subtleTextClass } from '../../lib/semantic-colors';
import { focusRing } from '../../lib/focus-ring';

export type Role = 'candidate' | 'recruiter';

export interface RoleToggleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Currently selected workspace role. */
  activeRole: Role;
  /** Called when the user switches between candidate and recruiter modes. */
  onChange: (role: Role) => void;
}

export const RoleToggle = React.forwardRef<HTMLDivElement, RoleToggleProps>(
  ({ activeRole, onChange, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        aria-label="Choisir l'espace utilisateur"
        className={cn(
          'inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/60',
          className
        )}
        {...props}
      >
        <button
          type="button"
          aria-pressed={activeRole === 'candidate'}
          onClick={() => onChange('candidate')}
          className={cn(
            'flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
            focusRing,
            activeRole === 'candidate'
              ? 'bg-white text-slate-800 shadow-sm'
              : cn(subtleTextClass, 'hover:text-slate-700')
          )}
        >
          <User className="w-3.5 h-3.5 text-brand-600" aria-hidden="true" />
          <span>Espace Candidat</span>
        </button>

        <button
          type="button"
          aria-pressed={activeRole === 'recruiter'}
          onClick={() => onChange('recruiter')}
          className={cn(
            'flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
            focusRing,
            activeRole === 'recruiter'
              ? 'bg-white text-slate-800 shadow-sm'
              : cn(subtleTextClass, 'hover:text-slate-700')
          )}
        >
          <Briefcase className="w-3.5 h-3.5 text-ai-600" aria-hidden="true" />
          <span>Espace Recruteur</span>
        </button>
      </div>
    );
  }
);

RoleToggle.displayName = 'RoleToggle';
