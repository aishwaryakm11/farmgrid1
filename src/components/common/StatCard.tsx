import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  subtext?: string;
  trend?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  subtext,
  trend,
  variant = 'default',
  className,
}) => {
  const iconColors = {
    default: 'text-farm-green bg-farm-sage/60',
    success: 'text-emerald-700 bg-emerald-100',
    warning: 'text-amber-700 bg-amber-100',
    danger: 'text-rose-700 bg-rose-100',
  };

  return (
    <Card className={cn('overflow-hidden border border-border/80 transition-all hover:shadow-sm', className)}>
      <CardContent className="p-5 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {subtext && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {subtext}
            </p>
          )}
          {trend && (
            <span className="inline-block text-xs font-medium text-emerald-700 mt-1">
              {trend}
            </span>
          )}
        </div>
        {Icon && (
          <div className={cn('p-2.5 rounded-lg shrink-0', iconColors[variant])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
