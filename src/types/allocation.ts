export interface PriorityScore {
  id: string;
  request_id: string;
  urgency_score: number;      // max 25
  weather_score: number;      // max 25
  crop_stage_score: number;   // max 20
  waiting_score: number;      // max 15
  logistics_score: number;    // max 10
  constraint_score: number;   // max 5
  total_score: number;        // max 100
  explanation: string;
  calculated_at: string;
}

export interface ConflictRecord {
  id: string;
  resource_id: string;
  resource_name: string;
  request_a_id: string;
  request_b_id: string;
  request_a_farmer: string;
  request_b_farmer: string;
  overlap_start: string;
  overlap_end: string;
  detected_at: string;
  resolution_status: 'Detected' | 'Resolved by next available slot' | 'Under Review';
  resolution_note: string;
}

export type DisruptionType =
  | 'Breakdown'
  | 'Maintenance'
  | 'Unavailable'
  | 'Delay'
  | 'Weather Alert'
  | 'Other';

export interface DisruptionRecord {
  id: string;
  resource_id: string;
  resource_name: string;
  owner_id?: string;
  disruption_type: DisruptionType;
  description: string;
  starts_at: string;
  ends_at: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active' | 'Resolved' | 'Reallocated';
  affected_bookings_count?: number;
  resolution_note?: string;
  created_by: string;
  created_at: string;
}

export interface AllocationRun {
  id: string;
  started_by: string;
  started_at: string;
  completed_at: string;
  status: 'Completed' | 'In Progress' | 'Failed';
  requests_processed: number;
  scheduled_count: number;
  waiting_count: number;
  conflicts_resolved: number;
}
