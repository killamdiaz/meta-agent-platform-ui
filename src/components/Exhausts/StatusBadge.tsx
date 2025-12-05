import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'active' | 'waiting' | 'disconnected';
  className?: string;
}

const statusConfig = {
  active: {
    label: 'Active',
    dotColor: 'bg-emerald-500',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    ringColor: 'ring-emerald-500/20'
  },
  waiting: {
    label: 'Waiting for Logs',
    dotColor: 'bg-amber-500',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    ringColor: 'ring-amber-500/20'
  },
  disconnected: {
    label: 'Disconnected',
    dotColor: 'bg-red-500',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
    ringColor: 'ring-red-500/20'
  }
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1",
      config.bgColor,
      config.textColor,
      config.ringColor,
      className
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dotColor, status === 'active' && "animate-pulse")} />
      {config.label}
    </span>
  );
};
