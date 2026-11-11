import React from 'react';
import { cn } from '@/lib/utils';
import {
  Clock,
  CheckCircle2,
  Hourglass,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Check,
  Wrench,
  AlertOctagon,
} from 'lucide-react';

export type AnyStatus =
  | 'Pending'
  | 'Scheduled'
  | 'Waiting'
  | 'Needs Changes'
  | 'Rescheduling Required'
  | 'Cancelled'
  | 'Completed'
  | 'Available'
  | 'Under Maintenance'
  | 'Broken Down'
  | 'Active'
  | 'Resolved'
  | 'Detected'
  | 'Resolved by next available slot'
  | string;

interface StatusBadgeProps {
  status: AnyStatus;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showIcon = true,
}) => {
  let badgeStyle = 'bg-stone-100 text-stone-700 border-stone-200';
  let IconComponent = Clock;

  switch (status) {
    case 'Scheduled':
    case 'Confirmed':
    case 'Completed':
    case 'Available':
    case 'Active':
      badgeStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      IconComponent = CheckCircle2;
      break;

    case 'Pending':
      badgeStyle = 'bg-amber-50 text-amber-800 border-amber-200';
      IconComponent = Clock;
      break;

    case 'Waiting':
      badgeStyle = 'bg-blue-50 text-blue-800 border-blue-200';
      IconComponent = Hourglass;
      break;

    case 'Needs Changes':
    case 'Under Maintenance':
    case 'Detected':
      badgeStyle = 'bg-amber-100 text-amber-900 border-amber-300';
      IconComponent = Wrench;
      break;

    case 'Rescheduling Required':
    case 'Broken Down':
    case 'Cancelled':
      badgeStyle = 'bg-rose-50 text-rose-800 border-rose-200';
      IconComponent = AlertOctagon;
      break;

    case 'Resolved by next available slot':
    case 'Resolved':
      badgeStyle = 'bg-teal-50 text-teal-800 border-teal-200';
      IconComponent = Check;
      break;

    default:
      badgeStyle = 'bg-stone-100 text-stone-700 border-stone-200';
      IconComponent = AlertTriangle;
      break;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
        badgeStyle,
        className
      )}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" />}
      <span>{status}</span>
    </span>
  );
};
