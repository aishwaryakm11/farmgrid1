import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '@/lib/constants';

interface AppLogoProps {
  className?: string;
  showTagline?: boolean;
  to?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  showTagline = false,
  to = '/',
}) => {
  return (
    <Link to={to} className={`flex items-center gap-3 group ${className}`}>
      <div className="w-9 h-9 rounded-lg bg-farm-green flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18V7l8-4 8 4v11" />
          <path d="M4 12h16" />
          <path d="M12 3v18" />
          <circle cx="12" cy="12" r="2.5" fill="#FFFFFF" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg tracking-tight text-farm-charcoal leading-none">
          {APP_NAME}
        </span>
        {showTagline && (
          <span className="text-[11px] text-muted-foreground font-medium mt-0.5">
            Resource Coordination
          </span>
        )}
      </div>
    </Link>
  );
};
