import { Resource, ResourceStatus } from '@/types/resource';

const STORAGE_KEY = 'farmgrid_resources_v1';

const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'RES-01',
    owner_id: 'owner-201',
    name: 'Combine Harvester H-02',
    category: 'Harvester',
    resource_type: 'Combine Harvester',
    description: 'Claas Dominator 130 multi-crop harvester with high-capacity grain tank, straw chopper, and 14ft cutter bar.',
    location_text: 'Shirwal Agro Hub, Gate 2, Satara',
    rental_price: 2400,
    price_unit: 'hour',
    specs_json: {
      capacity: '1.2 Tons / Hour',
      fuel: 'Diesel (Included)',
      operator: true,
      power_hp: '75 HP',
      attachments: ['Grain Tank', 'Straw Chopper', 'Soybean Header'],
    },
    operating_start: '06:00',
    operating_end: '18:00',
    available_from: '2026-06-10',
    available_to: '2026-07-31',
    owner_contact_name: 'Suresh Shinde',
    owner_contact_phone: '+91 98230 11223',
    status: 'Currently Booked',
    created_at: '2026-05-15T10:00:00Z',
  },
  {
    id: 'RES-02',
    owner_id: 'owner-201',
    name: 'Mahindra 575 DI Tractor',
    category: 'Tractor',
    resource_type: '45HP Tractor',
    description: '45HP multi-utility 4WD agricultural tractor equipped with heavy-duty rotary tiller and hydraulic tipping trolley.',
    location_text: 'Shirwal Agro Hub, Satara',
    rental_price: 950,
    price_unit: 'hour',
    specs_json: {
      capacity: '1,600 kg hydraulic lift',
      fuel: 'Diesel',
      operator: true,
      power_hp: '45 HP',
      attachments: ['Rotary Tiller', 'Leveling Blade', 'Subsoiler'],
    },
    operating_start: '07:00',
    operating_end: '19:00',
    available_from: '2026-06-01',
    available_to: '2026-07-31',
    owner_contact_name: 'Suresh Shinde',
    owner_contact_phone: '+91 98230 11223',
    status: 'Available',
    created_at: '2026-05-18T11:00:00Z',
  },
  {
    id: 'RES-03',
    owner_id: 'owner-201',
    name: 'Kirloskar 10HP Diesel Pump',
    category: 'Water Pump',
    resource_type: 'High Volume Irrigation Pump',
    description: 'Portable high-discharge diesel irrigation pump with 200m flexible delivery pipeline and foot valve.',
    location_text: 'Khed Farm Depot, Pune District',
    rental_price: 450,
    price_unit: 'hour',
    specs_json: {
      capacity: '1,200 Litres / Minute',
      fuel: 'Diesel',
      operator: false,
      power_hp: '10 HP',
      attachments: ['200m Delivery Hose', 'Suction Pipe', 'Strainer'],
    },
    operating_start: '06:00',
    operating_end: '20:00',
    available_from: '2026-06-17',
    available_to: '2026-07-31',
    owner_contact_name: 'Suresh Shinde',
    owner_contact_phone: '+91 98230 11223',
    status: 'Under Maintenance',
    created_at: '2026-05-20T08:30:00Z',
  },
  {
    id: 'RES-04',
    owner_id: 'owner-201',
    name: 'Sowing & Transplantation Crew (6 Persons)',
    category: 'Agricultural Labour',
    resource_type: 'Skilled Field Team',
    description: 'Experienced agricultural labor group specialized in precision paddy transplantation, sugarcane planting, and weeding.',
    location_text: 'Shirwal Village Cluster, Satara',
    rental_price: 3200,
    price_unit: 'day',
    specs_json: {
      capacity: 'Up to 4 Acres / Day',
      operator: true,
      attachments: ['Transplantation Trays', 'Hand Weeders'],
    },
    operating_start: '07:00',
    operating_end: '17:00',
    available_from: '2026-06-01',
    available_to: '2026-07-31',
    owner_contact_name: 'Suresh Shinde',
    owner_contact_phone: '+91 98230 11223',
    status: 'Available',
    created_at: '2026-05-25T09:00:00Z',
  },
  {
    id: 'RES-05',
    owner_id: 'owner-201',
    name: 'Shirwal Hermetic Grain Storage Unit B-2',
    category: 'Storage',
    resource_type: 'Moisture Controlled Storage Bay',
    description: 'Pest-proof hermetic storage chamber with digital humidity & temperature sensors for bagged grains.',
    location_text: 'Shirwal Central Grain Warehouse',
    rental_price: 600,
    price_unit: 'day',
    specs_json: {
      capacity: '200 Quintals (20 Metric Tons)',
      attachments: ['Moisture Sensor', 'Pallet Racks', 'Fumigation Seal'],
    },
    operating_start: '08:00',
    operating_end: '18:00',
    available_from: '2026-06-01',
    available_to: '2026-08-31',
    owner_contact_name: 'Suresh Shinde',
    owner_contact_phone: '+91 98230 11223',
    status: 'Available',
    created_at: '2026-05-28T14:00:00Z',
  },
];

class ResourceService {
  private getStore(): Resource[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESOURCES));
      return INITIAL_RESOURCES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_RESOURCES;
    }
  }

  private saveStore(items: Resource[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('farmgrid_resources_updated'));
  }

  public getAll(ownerId?: string): Resource[] {
    const all = this.getStore();
    return ownerId ? all.filter((r) => r.owner_id === ownerId) : all;
  }

  public getById(id: string): Resource | undefined {
    return this.getStore().find((r) => r.id === id);
  }

  public createResource(
    data: Omit<Resource, 'id' | 'created_at'>
  ): Resource {
    const existing = this.getStore();
    const newId = `RES-${String(existing.length + 1).padStart(2, '0')}`;
    const now = new Date().toISOString();

    const newResource: Resource = {
      ...data,
      id: newId,
      created_at: now,
      updated_at: now,
    };

    const updated = [newResource, ...existing];
    this.saveStore(updated);
    return newResource;
  }

  public updateResource(id: string, updates: Partial<Resource>): Resource | null {
    const existing = this.getStore();
    const idx = existing.findIndex((r) => r.id === id);
    if (idx === -1) return null;

    const updatedItem: Resource = {
      ...existing[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    existing[idx] = updatedItem;
    this.saveStore([...existing]);
    return updatedItem;
  }

  public deleteResource(id: string): boolean {
    const existing = this.getStore();
    const filtered = existing.filter((r) => r.id !== id);
    if (filtered.length === existing.length) return false;

    this.saveStore(filtered);
    return true;
  }

  public updateAvailability(
    id: string,
    status: ResourceStatus,
    availableFrom?: string,
    availableTo?: string
  ): Resource | null {
    return this.updateResource(id, {
      status,
      available_from: availableFrom,
      available_to: availableTo,
    });
  }

  public getOwnerStats(ownerId: string) {
    const list = this.getAll(ownerId);
    return {
      total: list.length,
      available: list.filter((r) => r.status === 'Available').length,
      booked: list.filter((r) => r.status === 'Currently Booked').length,
      unavailable: list.filter(
        (r) => r.status === 'Under Maintenance' || r.status === 'Broken Down' || r.status === 'Unavailable'
      ).length,
    };
  }

  public resetDemoData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESOURCES));
    window.dispatchEvent(new Event('farmgrid_resources_updated'));
  }
}

export const resourceService = new ResourceService();
