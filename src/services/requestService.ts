import { ResourceRequest, RequestStatus } from '@/types/request';

const STORAGE_KEY = 'farmgrid_requests_v1';

const INITIAL_REQUESTS: ResourceRequest[] = [
  {
    id: 'REQ-101',
    farmer_id: 'farmer-101',
    farmer_name: 'Ramesh Patel',
    category: 'Machinery',
    resource_type: 'Harvester',
    crop_name: 'Soybean',
    crop_stage: 'Peak ripening/Harvest-ready',
    land_area_acres: 12,
    earliest_start: '2026-06-14T07:00',
    latest_end: '2026-06-16T18:00',
    duration_hours: 6,
    urgency_level: 'Critical',
    urgency_reason: 'Crop reached 14% optimal moisture. Thunderstorm alert predicted within 48 hours.',
    farm_location: 'Plot 14, Khed Shivapur, Pune',
    additional_notes: 'Road access is 12ft wide. Trained combine operator requested with machine.',
    submitted_at: '2026-06-11T09:30:00Z',
    status: 'Scheduled',
    priority_score: 82,
    priority_breakdown: {
      urgency_score: 23,
      weather_score: 22,
      crop_stage_score: 18,
      waiting_score: 10,
      logistics_score: 5,
      constraint_score: 4,
      total_score: 82,
      explanation:
        'Request REQ-101 received a priority score of 82/100. The harvest deadline is close (23/25), simulated rain risk is high (22/25), the crop is at peak ripening (18/20), the request has waited two days (10/15), travel is short (5/10), and the required operator is confirmed available (4/5). The request was assigned Harvester H-02 on 14 June from 07:00 to 13:00.',
    },
    allocation_details: {
      booking_id: 'BK-9042',
      resource_id: 'RES-01',
      resource_name: 'Combine Harvester H-02',
      resource_category: 'Machinery',
      owner_name: 'Suresh Shinde',
      depot_location: 'Shirwal Agro Hub (4.5 km away)',
      start_at: '2026-06-14T07:00',
      end_at: '2026-06-14T13:00',
      buffer_minutes: 45,
      travel_minutes: 20,
      operator_included: true,
      status: 'Confirmed',
    },
    status_history: [
      {
        status: 'Pending',
        timestamp: '2026-06-11T09:30:00Z',
        note: 'Request received and placed into regional evaluation queue.',
      },
      {
        status: 'Scheduled',
        timestamp: '2026-06-12T18:30:00Z',
        note: 'Allocated Harvester H-02 following batch allocation run RUN-20260612-01.',
      },
    ],
    sync_status: 'Synced',
  },
  {
    id: 'REQ-102',
    farmer_id: 'farmer-101',
    farmer_name: 'Ramesh Patel',
    category: 'Machinery',
    resource_type: 'Tractor',
    crop_name: 'Sugarcane',
    crop_stage: 'Vegetative',
    land_area_acres: 8,
    earliest_start: '2026-06-18T08:00',
    latest_end: '2026-06-20T17:00',
    duration_hours: 8,
    urgency_level: 'Moderate',
    urgency_reason: 'Inter-row tillage and fertilizer incorporation required before scheduled canal discharge.',
    farm_location: 'Plot 7B, Khed Shivapur, Pune',
    additional_notes: 'Needs 55HP 4WD tractor with compatible rotary tiller attachment.',
    submitted_at: '2026-06-12T11:15:00Z',
    status: 'Pending',
    priority_score: 54,
    priority_breakdown: {
      urgency_score: 12,
      weather_score: 5,
      crop_stage_score: 5,
      waiting_score: 10,
      logistics_score: 7,
      constraint_score: 5,
      total_score: 54,
      explanation:
        'Request REQ-102 received an interim score of 54/100. Crop is vegetative with 6-day window buffer. Waiting time accrual in progress.',
    },
    status_history: [
      {
        status: 'Pending',
        timestamp: '2026-06-12T11:15:00Z',
        note: 'Submitted by farmer. Ready for next scheduled allocation run.',
      },
    ],
    sync_status: 'Synced',
  },
  {
    id: 'REQ-103',
    farmer_id: 'farmer-101',
    farmer_name: 'Ramesh Patel',
    category: 'Irrigation',
    resource_type: 'Water Pump',
    crop_name: 'Cotton',
    crop_stage: 'Early establishment',
    land_area_acres: 5,
    earliest_start: '2026-06-22T06:00',
    latest_end: '2026-06-24T18:00',
    duration_hours: 12,
    urgency_level: 'High',
    urgency_reason: 'Critical seedling moisture stress. Groundwater delivery required.',
    farm_location: 'East Parcel, Khed Shivapur',
    additional_notes: 'Requires 200m flexible delivery hose.',
    submitted_at: '2026-06-13T08:00:00Z',
    status: 'Waiting',
    priority_score: 61,
    priority_breakdown: {
      urgency_score: 18,
      weather_score: 5,
      crop_stage_score: 10,
      waiting_score: 6,
      logistics_score: 7,
      constraint_score: 5,
      total_score: 61,
      explanation:
        'Request REQ-103 scored 61/100. Candidate high-volume pump RES-03 is currently undergoing scheduled maintenance. Request placed at top of waiting queue.',
    },
    status_history: [
      {
        status: 'Pending',
        timestamp: '2026-06-13T08:00:00Z',
        note: 'Submitted.',
      },
      {
        status: 'Waiting',
        timestamp: '2026-06-13T18:30:00Z',
        note: 'Compatible resource under maintenance. Request retained in priority queue.',
      },
    ],
    sync_status: 'Synced',
  },
  {
    id: 'REQ-100',
    farmer_id: 'farmer-101',
    farmer_name: 'Ramesh Patel',
    category: 'Machinery',
    resource_type: 'Tractor',
    crop_name: 'Soybean',
    crop_stage: 'Early establishment',
    land_area_acres: 12,
    earliest_start: '2026-06-05T06:00',
    latest_end: '2026-06-06T18:00',
    duration_hours: 6,
    urgency_level: 'High',
    urgency_reason: 'Pre-sowing seedbed preparation.',
    farm_location: 'Plot 14, Khed Shivapur',
    submitted_at: '2026-06-03T10:00:00Z',
    status: 'Completed',
    priority_score: 76,
    allocation_details: {
      booking_id: 'BK-8901',
      resource_id: 'RES-02',
      resource_name: 'Mahindra 575 DI Tractor',
      resource_category: 'Machinery',
      owner_name: 'Suresh Shinde',
      depot_location: 'Shirwal Agro Hub',
      start_at: '2026-06-05T07:00',
      end_at: '2026-06-05T13:00',
      buffer_minutes: 30,
      travel_minutes: 15,
      operator_included: true,
      status: 'Completed',
    },
    status_history: [
      {
        status: 'Scheduled',
        timestamp: '2026-06-04T12:00:00Z',
        note: 'Allocated and confirmed.',
      },
      {
        status: 'Completed',
        timestamp: '2026-06-05T14:00:00Z',
        note: 'Field operation completed satisfactorily.',
      },
    ],
    sync_status: 'Synced',
  },
];

class RequestService {
  private getStore(): ResourceRequest[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_REQUESTS;
    }
  }

  private saveStore(requests: ResourceRequest[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    window.dispatchEvent(new Event('farmgrid_requests_updated'));
  }

  public getAll(): ResourceRequest[] {
    return this.getStore();
  }

  public getByFarmer(farmerId: string): ResourceRequest[] {
    return this.getStore().filter((r) => r.farmer_id === farmerId);
  }

  public getById(id: string): ResourceRequest | undefined {
    return this.getStore().find((r) => r.id === id);
  }

  public createRequest(
    data: Omit<ResourceRequest, 'id' | 'submitted_at' | 'status' | 'status_history' | 'sync_status'>
  ): ResourceRequest {
    const existing = this.getStore();
    const newId = `REQ-${100 + existing.length + 1}`;
    const now = new Date().toISOString();

    const newRequest: ResourceRequest = {
      ...data,
      id: newId,
      submitted_at: now,
      status: 'Pending',
      status_history: [
        {
          status: 'Pending',
          timestamp: now,
          note: 'Request submitted and entered regional coordination queue.',
        },
      ],
      sync_status: 'Synced',
    };

    const updated = [newRequest, ...existing];
    this.saveStore(updated);
    return newRequest;
  }

  public cancelRequest(id: string, reason?: string): ResourceRequest | null {
    const existing = this.getStore();
    const idx = existing.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    const req = existing[idx];
    const now = new Date().toISOString();

    const updatedReq: ResourceRequest = {
      ...req,
      status: 'Cancelled',
      status_history: [
        ...(req.status_history || []),
        {
          status: 'Cancelled',
          timestamp: now,
          note: reason || 'Cancelled by farmer before operation began.',
        },
      ],
    };

    existing[idx] = updatedReq;
    this.saveStore([...existing]);
    return updatedReq;
  }

  public getFarmerStats(farmerId: string) {
    const requests = this.getByFarmer(farmerId);
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === 'Pending').length,
      scheduled: requests.filter((r) => r.status === 'Scheduled').length,
      waiting: requests.filter((r) => r.status === 'Waiting').length,
      completed: requests.filter((r) => r.status === 'Completed').length,
      cancelled: requests.filter((r) => r.status === 'Cancelled').length,
    };
  }

  public resetDemoData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
    window.dispatchEvent(new Event('farmgrid_requests_updated'));
  }
}

export const requestService = new RequestService();
