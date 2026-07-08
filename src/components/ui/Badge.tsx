/** @deprecated Prefer StatusBadge for new code */
import { StatusBadge, type StatusTone } from './StatusBadge';

/** @deprecated Prefer StatusBadge for new code */
interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const variantToTone: Record<NonNullable<BadgeProps['variant']>, StatusTone> = {
  default: 'neutral',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return <StatusBadge label={label} tone={variantToTone[variant]} />;
}
