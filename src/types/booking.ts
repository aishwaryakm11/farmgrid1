export type BookingStatus = 'Confirmed' | 'Completed' | 'Cancelled' | 'Disrupted';

export interface Booking {
  id: string;
  request_id: string;
  resource_id: string;
  resource_name: string;
  resource_category?: string;
  owner_id?: string;
  farmer_id: string;
  farmer_name: string;
  farmer_phone?: string;
  farmer_village?: string;
  crop_name?: string;
  crop_stage?: string;
  land_area_acres?: number;
  priority_score?: number;
  duration_hours?: number;
  start_at: string;
  end_at: string;
  buffer_minutes: number;
  travel_minutes: number;
  status: BookingStatus;
  notes?: string;
  allocation_run_id?: string;
  created_at: string;
}
