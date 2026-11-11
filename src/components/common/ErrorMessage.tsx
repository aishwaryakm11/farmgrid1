import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive flex items-start gap-3',
        className
      )}
    >
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-destructive" />
      <div className="flex-1 space-y-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-sm text-destructive/90">{message}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-3 bg-white text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};
