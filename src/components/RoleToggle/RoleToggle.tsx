import React, { useRef } from 'react';
import { User, Briefcase } from 'lucide-react';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';

export type Role = 'candidate' | 'recruiter';

const ROLES: Role[] = ['candidate', 'recruiter'];

export interface RoleToggleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Currently selected workspace role. */
  activeRole: Role;
  /** Called when the user switches between candidate and recruiter modes. */
  onChange: (role: Role) => void;
}

export const RoleToggle = React.forwardRef<HTMLDivElement, RoleToggleProps>(
  ({ activeRole, onChange, className, onKeyDown, ...props }, ref) => {
    const candidateRef = useRef<HTMLButtonElement>(null);
    const recruiterRef = useRef<HTMLButtonElement>(null);

    const focusRole = (role: Role) => {
      onChange(role);
      requestAnimationFrame(() => {
        if (role === 'candidate') candidateRef.current?.focus();
        else recruiterRef.current?.focus();
      });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = ROLES.indexOf(activeRole);

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        focusRole(ROLES[(currentIndex + 1) % ROLES.length]);
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        focusRole(ROLES[(currentIndex - 1 + ROLES.length) % ROLES.length]);
      }

      onKeyDown?.(event);
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label="Choisir l'espace utilisateur"
        onKeyDown={handleKeyDown}
        className={cn(
          'inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/60',
          className
        )}
        {...props}
      >
        <button
          ref={candidateRef}
          type="button"
          role="radio"
          aria-checked={activeRole === 'candidate'}
          tabIndex={activeRole === 'candidate' ? 0 : -1}
          onClick={() => onChange('candidate')}
          className={cn(
            'flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
            focusRing,
            activeRole === 'candidate'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <User className="w-3.5 h-3.5 text-brand-600" aria-hidden="true" />
          <span>Espace Candidat</span>
        </button>

        <button
          ref={recruiterRef}
          type="button"
          role="radio"
          aria-checked={activeRole === 'recruiter'}
          tabIndex={activeRole === 'recruiter' ? 0 : -1}
          onClick={() => onChange('recruiter')}
          className={cn(
            'flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
            focusRing,
            activeRole === 'recruiter'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
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
