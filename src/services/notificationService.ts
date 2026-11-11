import { AppNotification, NotificationCategory } from '@/types/notification';

const STORAGE_KEY = 'farmgrid_notifications_v1';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-01',
    user_id: 'farmer-101',
    category: 'resource_allocated',
    title: 'Resource Allocated: Harvester Unit H-02',
    message: 'Your request REQ-101 (Soybean harvest) has been assigned Combine Harvester H-02 for 14 June, 07:00 — 13:00.',
    type: 'success',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    related_request_id: 'REQ-101',
    related_link: '/farmer/request/REQ-101',
    read_at: null,
  },
  {
    id: 'NOTIF-02',
    user_id: 'farmer-101',
    category: 'request_approved',
    title: 'Request Evaluated & Scored (82/100)',
    message: 'FarmGrid completed deterministic scoring for REQ-101. High urgency and weather risk placed your request at top rank.',
    type: 'info',
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    related_request_id: 'REQ-101',
    related_link: '/farmer/request/REQ-101',
    read_at: null,
  },
  {
    id: 'NOTIF-03',
    user_id: 'farmer-101',
    category: 'request_submitted',
    title: 'Request Submitted: REQ-102 (Tractor)',
    message: 'Your equipment request for 55HP Tractor on Plot 7B has been received and queued in Pending status.',
    type: 'info',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    related_request_id: 'REQ-102',
    related_link: '/farmer/request/REQ-102',
    read_at: new Date(Date.now() - 20 * 3600000).toISOString(),
  },
  {
    id: 'NOTIF-04',
    user_id: 'farmer-101',
    category: 'booking_updated',
    title: 'Transit Buffer Confirmed: 45 Minutes',
    message: 'Depot dispatch confirmed 45-minute road transit buffer from Shirwal Hub to Plot 14.',
    type: 'info',
    created_at: new Date(Date.now() - 36 * 3600000).toISOString(),
    related_request_id: 'REQ-101',
    related_link: '/farmer/allocations',
    read_at: new Date(Date.now() - 30 * 3600000).toISOString(),
  },
  {
    id: 'NOTIF-05',
    user_id: 'farmer-101',
    category: 'resource_disruption',
    title: 'Regional Fleet Notice: Diesel Pump Maintenance',
    message: 'Resource RES-03 is currently undergoing scheduled impeller maintenance. Queue requests will be fulfilled sequentially upon completion.',
    type: 'warning',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    related_request_id: 'REQ-103',
    related_link: '/farmer/request/REQ-103',
    read_at: new Date(Date.now() - 40 * 3600000).toISOString(),
  },
  {
    id: 'NOTIF-OWNER-01',
    user_id: 'owner-201',
    category: 'resource_allocated',
    title: 'New Confirmed Booking: Combine Harvester H-02',
    message: 'Allocation run assigned Harvester H-02 to Farmer Ramesh Patel for 14 June, 07:00 — 13:00 (Ref: BK-9042).',
    type: 'success',
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    related_link: '/owner/bookings',
    read_at: null,
  },
  {
    id: 'NOTIF-OWNER-02',
    user_id: 'owner-201',
    category: 'booking_updated',
    title: 'Upcoming Dispatch: Mahindra 575 DI Tractor',
    message: 'Booking BK-9045 scheduled for tomorrow, 15 June at 09:00 with Anand Shinde. Please ensure fuel & tiller check.',
    type: 'info',
    created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    related_link: '/owner/calendar',
    read_at: null,
  },
  {
    id: 'NOTIF-OWNER-03',
    user_id: 'owner-201',
    category: 'resource_disruption',
    title: 'Maintenance Logged: Kirloskar 10HP Pump',
    message: 'Maintenance window active until 16 June. Allocation engine has paused candidate matches for this unit.',
    type: 'warning',
    created_at: new Date(Date.now() - 28 * 3600000).toISOString(),
    related_link: '/owner/disruption',
    read_at: new Date(Date.now() - 25 * 3600000).toISOString(),
  },
];

class NotificationService {
  private getStore(): AppNotification[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  private saveStore(items: AppNotification[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('farmgrid_notifications_updated'));
  }

  public getByUser(userId: string): AppNotification[] {
    return this.getStore().filter((n) => n.user_id === userId);
  }

  public getUnreadCount(userId: string): number {
    return this.getByUser(userId).filter((n) => !n.read_at).length;
  }

  public markAsRead(id: string): void {
    const items = this.getStore();
    const idx = items.findIndex((n) => n.id === id);
    if (idx !== -1) {
      items[idx].read_at = new Date().toISOString();
      this.saveStore([...items]);
    }
  }

  public markAllAsRead(userId: string): void {
    const items = this.getStore();
    const now = new Date().toISOString();
    const updated = items.map((n) => (n.user_id === userId ? { ...n, read_at: now } : n));
    this.saveStore(updated);
  }

  public deleteNotification(id: string): void {
    const items = this.getStore().filter((n) => n.id !== id);
    this.saveStore(items);
  }

  public addNotification(
    data: Omit<AppNotification, 'id' | 'created_at' | 'read_at'>
  ): AppNotification {
    const items = this.getStore();
    const newNotif: AppNotification = {
      ...data,
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    this.saveStore([newNotif, ...items]);
    return newNotif;
  }
}

export const notificationService = new NotificationService();
