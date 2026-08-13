import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { User, Briefcase } from 'lucide-react';

export type Role = 'candidate' | 'recruiter';

export interface RoleToggleProps {
  activeRole: Role;
  onChange: (role: Role) => void;
  className?: string;
}

export const RoleToggle: React.FC<RoleToggleProps> = ({
  activeRole,
  onChange,
  className,
}) => {
  return (
    <div className={twMerge('inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/60', className)}>
      <button
        type="button"
        onClick={() => onChange('candidate')}
        className={clsx(
          'flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
          activeRole === 'candidate'
            ? 'bg-white text-slate-800 shadow-xs'
            : 'text-slate-500 hover:text-slate-700'
        )}
      >
        <User className="w-3.5 h-3.5 text-brand-600" />
        <span>Espace Candidat</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('recruiter')}
        className={clsx(
          'flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
          activeRole === 'recruiter'
            ? 'bg-white text-slate-800 shadow-xs'
            : 'text-slate-500 hover:text-slate-700'
        )}
      >
        <Briefcase className="w-3.5 h-3.5 text-ai-600" />
        <span>Espace Recruteur</span>
      </button>
    </div>
  );
};
