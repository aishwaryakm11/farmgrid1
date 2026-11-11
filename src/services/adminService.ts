import { UserProfile } from '@/types/user';
import { requestService } from './requestService';
import { resourceService } from './resourceService';
import { bookingService } from './bookingService';
import { disruptionService } from './disruptionService';

const USERS_STORAGE_KEY = 'farmgrid_managed_users_v1';

const INITIAL_FARMERS: UserProfile[] = [
  {
    id: 'farmer-101',
    full_name: 'Ramesh Patel (Farmer A)',
    email: 'ramesh.farmer@farmgrid.org',
    phone: '+91 98765 43210',
    role: 'farmer',
    village: 'Khed Shivapur',
    district: 'Pune',
    farm_size_acres: 12,
    crop_name: 'Soybean & Sugarcane',
    status: 'Active',
    created_at: '2026-05-10T08:00:00Z',
  },
  {
    id: 'farmer-102',
    full_name: 'Anand Shinde (Farmer B)',
    email: 'anand.shinde@farmgrid.org',
    phone: '+91 97654 32109',
    role: 'farmer',
    village: 'Shirwal North',
    district: 'Satara',
    farm_size_acres: 6,
    crop_name: 'Sugarcane',
    status: 'Active',
    created_at: '2026-05-14T09:30:00Z',
  },
  {
    id: 'farmer-103',
    full_name: 'Sanjay Jadhav (Farmer C)',
    email: 'sanjay.jadhav@farmgrid.org',
    phone: '+91 96543 21098',
    role: 'farmer',
    village: 'Shirwal South',
    district: 'Satara',
    farm_size_acres: 8,
    crop_name: 'Soybean',
    status: 'Active',
    created_at: '2026-05-18T11:00:00Z',
  },
  {
    id: 'farmer-104',
    full_name: 'Kishore Deshmukh',
    email: 'kishore.d@farmgrid.org',
    phone: '+91 95432 10987',
    role: 'farmer',
    village: 'Bhor Valley',
    district: 'Pune',
    farm_size_acres: 15,
    crop_name: 'Wheat & Pulses',
    status: 'Active',
    created_at: '2026-05-22T14:15:00Z',
  },
  {
    id: 'farmer-105',
    full_name: 'Bapu More',
    email: 'bapu.more@farmgrid.org',
    phone: '+91 94321 09876',
    role: 'farmer',
    village: 'Khed East',
    district: 'Pune',
    farm_size_acres: 5,
    crop_name: 'Cotton & Vegetables',
    status: 'Inactive',
    created_at: '2026-05-25T16:00:00Z',
  },
];

const INITIAL_OWNERS: UserProfile[] = [
  {
    id: 'owner-201',
    full_name: 'Suresh Shinde',
    email: 'suresh.owner@farmgrid.org',
    phone: '+91 98230 11223',
    role: 'owner',
    village: 'Shirwal Agro Hub',
    district: 'Satara',
    depot_name: 'Shirwal Central Fleet Hub',
    status: 'Active',
    created_at: '2026-05-01T10:00:00Z',
  },
  {
    id: 'owner-202',
    full_name: 'Mahendra Patil',
    email: 'mahendra.patil@farmgrid.org',
    phone: '+91 98123 44556',
    role: 'owner',
    village: 'Khed Shivapur Depot',
    district: 'Pune',
    depot_name: 'Khed Agro Service Center',
    status: 'Active',
    created_at: '2026-05-05T12:00:00Z',
  },
  {
    id: 'owner-203',
    full_name: 'Balasaheb Thorat',
    email: 'balasaheb.thorat@farmgrid.org',
    phone: '+91 98987 66554',
    role: 'owner',
    village: 'Wai Rural Hub',
    district: 'Satara',
    depot_name: 'Krishna Valley Machinery Co-op',
    status: 'Active',
    created_at: '2026-05-12T15:00:00Z',
  },
];

class AdminService {
  private getUsersStore(): { farmers: UserProfile[]; owners: UserProfile[] } {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      const initial = { farmers: INITIAL_FARMERS, owners: INITIAL_OWNERS };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return { farmers: INITIAL_FARMERS, owners: INITIAL_OWNERS };
    }
  }

  private saveUsersStore(data: { farmers: UserProfile[]; owners: UserProfile[] }) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('farmgrid_users_updated'));
  }

  public getFarmers(): UserProfile[] {
    return this.getUsersStore().farmers;
  }

  public getOwners(): UserProfile[] {
    return this.getUsersStore().owners;
  }

  public toggleFarmerStatus(id: string): UserProfile | null {
    const store = this.getUsersStore();
    const idx = store.farmers.findIndex((f) => f.id === id);
    if (idx === -1) return null;

    const current = store.farmers[idx];
    const updated: UserProfile = {
      ...current,
      status: current.status === 'Active' ? 'Inactive' : 'Active',
    };
    store.farmers[idx] = updated;
    this.saveUsersStore(store);
    return updated;
  }

  public toggleOwnerStatus(id: string): UserProfile | null {
    const store = this.getUsersStore();
    const idx = store.owners.findIndex((o) => o.id === id);
    if (idx === -1) return null;

    const current = store.owners[idx];
    const updated: UserProfile = {
      ...current,
      status: current.status === 'Active' ? 'Inactive' : 'Active',
    };
    store.owners[idx] = updated;
    this.saveUsersStore(store);
    return updated;
  }

  public getAdminStats() {
    const farmers = this.getFarmers();
    const owners = this.getOwners();
    const resources = resourceService.getAll();
    const requests = requestService.getAll();
    const bookings = bookingService.getAll();
    const disruptions = disruptionService.getAll();

    return {
      totalFarmers: farmers.length,
      activeFarmers: farmers.filter((f) => f.status === 'Active').length,
      totalOwners: owners.length,
      activeOwners: owners.filter((o) => o.status === 'Active').length,
      totalResources: resources.length,
      activeResources: resources.filter((r) => r.status === 'Available' || r.status === 'Currently Booked').length,
      pendingRequests: requests.filter((r) => r.status === 'Pending').length,
      scheduledBookings: bookings.filter((b) => b.status === 'Confirmed').length,
      activeDisruptions: disruptions.filter((d) => d.status === 'Active').length,
    };
  }

  public getDemandByCategoryData() {
    const requests = requestService.getAll();
    const counts: Record<string, number> = {
      Machinery: 0,
      Harvester: 0,
      Tractor: 0,
      Irrigation: 0,
      Storage: 0,
      Labour: 0,
    };

    requests.forEach((r) => {
      if (counts[r.resource_type] !== undefined) counts[r.resource_type]++;
      else if (counts[r.category] !== undefined) counts[r.category]++;
      else counts.Machinery++;
    });

    return [
      { name: 'Harvester', demand: counts.Harvester || 4, fill: '#246B45' },
      { name: 'Tractor', demand: counts.Tractor || 5, fill: '#3D8C5F' },
      { name: 'Irrigation', demand: counts.Irrigation || 2, fill: '#2563EB' },
      { name: 'Labour', demand: counts.Labour || 1, fill: '#D97706' },
      { name: 'Storage', demand: counts.Storage || 1, fill: '#8B5CF6' },
    ];
  }

  public getRequestStatusData() {
    const requests = requestService.getAll();
    return [
      { name: 'Pending', count: requests.filter((r) => r.status === 'Pending').length || 1, color: '#D97706' },
      { name: 'Scheduled', count: requests.filter((r) => r.status === 'Scheduled').length || 1, color: '#16A34A' },
      { name: 'Waiting', count: requests.filter((r) => r.status === 'Waiting').length || 1, color: '#2563EB' },
      { name: 'Completed', count: requests.filter((r) => r.status === 'Completed').length || 1, color: '#4B5563' },
      { name: 'Cancelled', count: requests.filter((r) => r.status === 'Cancelled').length || 0, color: '#DC2626' },
    ];
  }
}

export const adminService = new AdminService();
