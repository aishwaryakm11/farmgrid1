import { Booking } from '@/types/booking';

const STORAGE_KEY = 'farmgrid_bookings_v1';

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-9042',
    request_id: 'REQ-101',
    resource_id: 'RES-01',
    resource_name: 'Combine Harvester H-02',
    resource_category: 'Harvester',
    owner_id: 'owner-201',
    farmer_id: 'farmer-101',
    farmer_name: 'Ramesh Patel',
    farmer_phone: '+91 98765 43210',
    farmer_village: 'Plot 14, Khed Shivapur, Pune',
    crop_name: 'Soybean',
    crop_stage: 'Peak ripening/Harvest-ready',
    land_area_acres: 12,
    priority_score: 82,
    duration_hours: 6,
    start_at: '2026-06-14T07:00',
    end_at: '2026-06-14T13:00',
    buffer_minutes: 45,
    travel_minutes: 20,
    status: 'Confirmed',
    notes: 'Operator requested with machine. Road access is 12ft wide gravel.',
    allocation_run_id: 'RUN-20260612-01',
    created_at: '2026-06-12T18:30:00Z',
  },
  {
    id: 'BK-9045',
    request_id: 'REQ-105',
    resource_id: 'RES-02',
    resource_name: 'Mahindra 575 DI Tractor',
    resource_category: 'Tractor',
    owner_id: 'owner-201',
    farmer_id: 'farmer-102',
    farmer_name: 'Anand Shinde',
    farmer_phone: '+91 97654 32109',
    farmer_village: 'Shirwal North Agro Belt',
    crop_name: 'Sugarcane',
    crop_stage: 'Vegetative',
    land_area_acres: 6,
    priority_score: 74,
    duration_hours: 4,
    start_at: '2026-06-15T09:00',
    end_at: '2026-06-15T13:00',
    buffer_minutes: 30,
    travel_minutes: 15,
    status: 'Confirmed',
    notes: 'Rotary tiller attachment confirmed.',
    allocation_run_id: 'RUN-20260613-01',
    created_at: '2026-06-13T18:30:00Z',
  },
  {
    id: 'BK-8901',
    request_id: 'REQ-100',
    resource_id: 'RES-02',
    resource_name: 'Mahindra 575 DI Tractor',
    resource_category: 'Tractor',
    owner_id: 'owner-201',
    farmer_id: 'farmer-101',
    farmer_name: 'Ramesh Patel',
    farmer_phone: '+91 98765 43210',
    farmer_village: 'Plot 14, Khed Shivapur',
    crop_name: 'Soybean',
    crop_stage: 'Early establishment',
    land_area_acres: 12,
    priority_score: 76,
    duration_hours: 6,
    start_at: '2026-06-05T07:00',
    end_at: '2026-06-05T13:00',
    buffer_minutes: 30,
    travel_minutes: 15,
    status: 'Completed',
    notes: 'Pre-sowing seedbed tillage completed on schedule.',
    allocation_run_id: 'RUN-20260604-01',
    created_at: '2026-06-04T12:00:00Z',
  },
];

class BookingService {
  private getStore(): Booking[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BOOKINGS;
    }
  }

  private saveStore(items: Booking[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('farmgrid_bookings_updated'));
  }

  public getAll(): Booking[] {
    return this.getStore();
  }

  public getByOwner(ownerId: string): Booking[] {
    return this.getStore().filter((b) => b.owner_id === ownerId || !b.owner_id);
  }

  public getByResource(resourceId: string): Booking[] {
    return this.getStore().filter((b) => b.resource_id === resourceId);
  }

  public getById(id: string): Booking | undefined {
    return this.getStore().find((b) => b.id === id);
  }

  public getUpcomingBookings(ownerId: string): Booking[] {
    return this.getByOwner(ownerId).filter(
      (b) => b.status === 'Confirmed'
    );
  }
}

export const bookingService = new BookingService();
