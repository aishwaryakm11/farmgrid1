export type RequestStatus =
  | 'Pending'
  | 'Scheduled'
  | 'Waiting'
  | 'Needs Changes'
  | 'Rescheduling Required'
  | 'Cancelled'
  | 'Completed';

export type UrgencyLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface PriorityBreakdown {
  urgency_score: number;      // max 25
  weather_score: number;      // max 25 (simulated)
  crop_stage_score: number;   // max 20
  waiting_score: number;      // max 15
  logistics_score: number;    // max 10 (simulated)
  constraint_score: number;   // max 5
  total_score: number;        // max 100
  explanation: string;
}

export interface AllocationDetails {
  booking_id: string;
  resource_id: string;
  resource_name: string;
  resource_category: string;
  owner_name: string;
  owner_contact_note?: string; // privacy preserved: e.g. "Provided upon arrival"
  depot_location: string;
  start_at: string;
  end_at: string;
  buffer_minutes: number;
  travel_minutes: number;
  operator_included: boolean;
  status: 'Confirmed' | 'Completed' | 'Rescheduling Required';
}

export interface ResourceRequest {
  id: string;
  farmer_id: string;
  farmer_name?: string;
  category: string;
  resource_type: string;
  crop_name: string;
  crop_stage: string;
  land_area_acres: number;
  earliest_start: string;
  latest_end: string;
  duration_hours: number;
  urgency_level: UrgencyLevel;
  urgency_reason: string;
  farm_location: string;
  additional_notes?: string;
  latitude?: number;
  longitude?: number;
  submitted_at: string;
  status: RequestStatus;
  priority_score?: number;
  priority_breakdown?: PriorityBreakdown;
  allocation_details?: AllocationDetails;
  status_history?: {
    status: RequestStatus;
    timestamp: string;
    note: string;
  }[];
  sync_status?: 'Synced' | 'Pending Sync' | 'Sync Failed';
}
