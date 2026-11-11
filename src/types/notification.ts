export type NotificationCategory =
  | 'request_submitted'
  | 'request_approved'
  | 'resource_allocated'
  | 'booking_updated'
  | 'resource_disruption'
  | 'system_alert'
  | 'disruption'
  | 'allocation_result';

export interface AppNotification {
  id: string;
  user_id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  read_at?: string | null;
  created_at: string;
  related_request_id?: string;
  related_link?: string;
}
