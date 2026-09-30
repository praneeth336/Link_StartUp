import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PrivacyBadgeProps {
  compact?: boolean;
}

export const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-help">
              <ShieldCheck className="h-3 w-3" /> Privacy Guarded
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">
            Personal data is protected. Only profile info and verified email are exposed to matched contacts. No address or phone data shared.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs">
      <Lock className="h-4 w-4 flex-shrink-0 text-emerald-500" />
      <div>
        <strong className="font-semibold block text-emerald-800 dark:text-emerald-200">Strict Privacy Enforcement</strong>
        User identity & personal data protected. Profile details and email are visible strictly to connected collaboration partners.
      </div>
    </div>
  );
};

export default PrivacyBadge;
