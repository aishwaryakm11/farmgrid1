import { DisruptionRecord, DisruptionType } from '@/types/allocation';
import { resourceService } from './resourceService';
import { notificationService } from './notificationService';

const STORAGE_KEY = 'farmgrid_disruptions_v1';

const INITIAL_DISRUPTIONS: DisruptionRecord[] = [
  {
    id: 'DIS-01',
    resource_id: 'RES-03',
    resource_name: 'Kirloskar 10HP Diesel Pump',
    owner_id: 'owner-201',
    disruption_type: 'Maintenance',
    description: 'Scheduled mechanical impeller seal replacement and gasket overhaul. Replacement parts arrived from Pune.',
    starts_at: '2026-06-12T08:00',
    ends_at: '2026-06-16T18:00',
    severity: 'Medium',
    status: 'Active',
    affected_bookings_count: 1,
    resolution_note: 'Request REQ-103 retained at top of queue for immediate dispatch once maintenance concludes.',
    created_by: 'Suresh Shinde (Owner)',
    created_at: '2026-06-12T08:30:00Z',
  },
  {
    id: 'DIS-02',
    resource_id: 'RES-01',
    resource_name: 'Combine Harvester H-02',
    owner_id: 'owner-201',
    disruption_type: 'Delay',
    description: 'Unpaved village access road obstructed by fallen acacia limb. Delaying morning transfer by 45 minutes.',
    starts_at: '2026-06-10T07:00',
    ends_at: '2026-06-10T11:00',
    severity: 'Low',
    status: 'Resolved',
    affected_bookings_count: 0,
    resolution_note: 'Route cleared and transit completed safely within allocated buffer.',
    created_by: 'Suresh Shinde (Owner)',
    created_at: '2026-06-10T07:15:00Z',
  },
];

class DisruptionService {
  private getStore(): DisruptionRecord[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DISRUPTIONS));
      return INITIAL_DISRUPTIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DISRUPTIONS;
    }
  }

  private saveStore(items: DisruptionRecord[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('farmgrid_disruptions_updated'));
  }

  public getAll(): DisruptionRecord[] {
    return this.getStore();
  }

  public getByOwner(ownerId: string): DisruptionRecord[] {
    return this.getStore().filter((d) => d.owner_id === ownerId || !d.owner_id);
  }

  public createDisruption(data: {
    resource_id: string;
    resource_name: string;
    owner_id: string;
    disruption_type: DisruptionType;
    description: string;
    starts_at: string;
    ends_at: string;
    severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  }): DisruptionRecord {
    const existing = this.getStore();
    const newId = `DIS-${String(existing.length + 1).padStart(2, '0')}`;
    const now = new Date().toISOString();

    const newRecord: DisruptionRecord = {
      ...data,
      id: newId,
      severity: data.severity || 'High',
      status: 'Active',
      affected_bookings_count: data.disruption_type === 'Breakdown' ? 1 : 0,
      resolution_note: 'Flagged for system evaluation and admin reallocation check.',
      created_by: 'Resource Owner',
      created_at: now,
    };

    // Automatically update resource status
    const statusMap = {
      Breakdown: 'Broken Down',
      Maintenance: 'Under Maintenance',
      Unavailable: 'Unavailable',
      Delay: 'Under Maintenance',
      'Weather Alert': 'Unavailable',
      Other: 'Unavailable',
    } as const;

    const newResourceStatus = statusMap[data.disruption_type] || 'Unavailable';
    resourceService.updateResource(data.resource_id, {
      status: newResourceStatus,
    });

    // Create notification
    notificationService.addNotification({
      user_id: data.owner_id,
      category: 'resource_disruption',
      title: `Disruption Logged: ${data.resource_name}`,
      message: `Resource marked as ${newResourceStatus}. Scheduled from ${data.starts_at.replace('T', ' ')} to ${data.ends_at.replace('T', ' ')}.`,
      type: 'warning',
      related_link: '/owner/disruption',
    });

    const updated = [newRecord, ...existing];
    this.saveStore(updated);
    return newRecord;
  }
  public resolveDisruption(id: string, note?: string): DisruptionRecord | null {
    const store = this.getStore();
    const idx = store.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    store[idx] = {
      ...store[idx],
      status: 'Resolved',
      resolution_note: note ?? store[idx].resolution_note ?? 'Resolved by admin.',
    };
    this.saveStore(store);
    return store[idx];
  }
}

export const disruptionService = new DisruptionService();
