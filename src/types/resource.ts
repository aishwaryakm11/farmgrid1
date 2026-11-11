export type ResourceStatus =
  | 'Available'
  | 'Under Maintenance'
  | 'Broken Down'
  | 'Unavailable'
  | 'Currently Booked';

export type ResourceCategory =
  | 'Tractor'
  | 'Harvester'
  | 'Water Pump'
  | 'Agricultural Labour'
  | 'Storage'
  | 'Machinery'
  | 'Irrigation'
  | 'Labour'
  | 'Specialized Service';

export interface ResourceSpecs {
  capacity?: string;
  fuel?: string;
  operator?: boolean;
  power_hp?: string;
  attachments?: string[];
  dimensions?: string;
}

export interface Resource {
  id: string;
  owner_id: string;
  name: string;
  category: string;
  resource_type: string;
  description: string;
  location_text: string;
  latitude?: number;
  longitude?: number;
  rental_price: number;
  price_unit: 'hour' | 'day';
  specs_json?: ResourceSpecs;
  operating_start?: string; // e.g. "06:00"
  operating_end?: string;   // e.g. "18:00"
  available_from?: string;  // e.g. "2026-06-01"
  available_to?: string;    // e.g. "2026-07-31"
  owner_contact_name?: string;
  owner_contact_phone?: string;
  status: ResourceStatus;
  created_at: string;
  updated_at?: string;
}
