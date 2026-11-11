export const APP_NAME = 'FarmGrid';
export const APP_TAGLINE = 'The right resource. The right farm. The right time.';
export const APP_HERO_SUBTITLE =
  'Coordinates agricultural resource sharing between farmers and equipment owners based on urgency, crop stage, and conflict-free scheduling.';

export const ROLES = {
  FARMER: 'farmer',
  OWNER: 'owner',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const RESOURCE_CATEGORIES = [
  'Machinery',
  'Irrigation',
  'Storage',
  'Transport',
  'Labour',
  'Specialized Service',
] as const;

export const CROP_STAGES = [
  'Early establishment',
  'Vegetative',
  'Flowering/Fruit setting',
  'Late ripening',
  'Peak ripening/Harvest-ready',
] as const;

export const REQUEST_STATUSES = {
  PENDING: 'Pending',
  SCHEDULED: 'Scheduled',
  WAITING: 'Waiting',
  NEEDS_CHANGES: 'Needs Changes',
  RESCHEDULING_REQUIRED: 'Rescheduling Required',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
} as const;

export const RESOURCE_STATUSES = {
  AVAILABLE: 'Available',
  UNDER_MAINTENANCE: 'Under Maintenance',
  BROKEN_DOWN: 'Broken Down',
} as const;
