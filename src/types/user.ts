import { UserRole } from '@/lib/constants';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  village?: string;
  district?: string;
  farm_size_acres?: number;
  crop_name?: string;
  depot_name?: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}
