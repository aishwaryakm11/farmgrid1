import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { resourceService } from '@/services/resourceService';
import { bookingService } from '@/services/bookingService';
import { Resource, ResourceStatus } from '@/types/resource';
import { Booking } from '@/types/booking';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Sliders,
  Save,
  Tractor,
} from 'lucide-react';

export const AvailabilityManagementPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const ownerId = user?.id || 'owner-201';

  const [resources, setResources] = useState<Resource[]>(() =>
    resourceService.getAll(ownerId)
  );
  const [selectedResourceId, setSelectedResourceId] = useState<string>(
    resources[0]?.id || 'RES-01'
  );
  const [bookings, setBookings] = useState<Booking[]>(() =>
    bookingService.getAll()
  );

  const selectedResource = resources.find((r) => r.id === selectedResourceId);
  const resourceBookings = bookings.filter(
    (b) => b.resource_id === selectedResourceId && b.status === 'Confirmed'
  );

  // Form State
  const [status, setStatus] = useState<ResourceStatus>('Available');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTo, setAvailableTo] = useState('');
  const [operatingStart, setOperatingStart] = useState('06:00');
  const [operatingEnd, setOperatingEnd] = useState('18:00');

  const [isSaved, setIsSaved] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    if (selectedResource) {
      setStatus(selectedResource.status);
      setAvailableFrom(selectedResource.available_from || '2026-06-01');
      setAvailableTo(selectedResource.available_to || '2026-07-31');
      setOperatingStart(selectedResource.operating_start || '06:00');
      setOperatingEnd(selectedResource.operating_end || '18:00');
      setWarningMessage('');
    }
  }, [selectedResourceId]);

  const handleResourceChange = (id: string) => {
    setSelectedResourceId(id);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource) return;

    // Integrity check: if owner attempts to mark as Unavailable or Under Maintenance while having confirmed bookings:
    if (
      (status === 'Unavailable' || status === 'Under Maintenance' || status === 'Broken Down') &&
      resourceBookings.length > 0
    ) {
      setWarningMessage(
        `Notice: ${selectedResource.name} currently has ${resourceBookings.length} confirmed booking(s). Marking this unit as ${status} will trigger a disruption review and potential rescheduling. Please use 'Report Disruption' if a mechanical issue occurred.`
      );
    } else {
      setWarningMessage('');
    }

    resourceService.updateResource(selectedResource.id, {
      status,
      available_from: availableFrom,
      available_to: availableTo,
      operating_start: operatingStart,
      operating_end: operatingEnd,
    });

    setResources(resourceService.getAll(ownerId));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Fleet Availability & Calendar Controls"
        description="Configure available date windows and operating hours. Avoid dates that conflict with confirmed farmer reservations."
      />

      {isSaved && (
        <div className="p-3.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            <strong>Availability Saved:</strong> Status and date window for {selectedResource?.name} updated in the allocation pool.
          </span>
        </div>
      )}

      {warningMessage && (
        <div className="p-4 rounded-lg border border-amber-300 bg-amber-50 text-amber-950 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Booking Overlap Caution</p>
            <p className="mt-0.5 leading-relaxed">{warningMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resource Selector Column */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
              Select Equipment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            {resources.map((res) => {
              const isSelected = res.id === selectedResourceId;
              const hasBookings = bookings.some(
                (b) => b.resource_id === res.id && b.status === 'Confirmed'
              );
              return (
                <div
                  key={res.id}
                  onClick={() => handleResourceChange(res.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'border-farm-green bg-farm-sage/40 ring-1 ring-farm-green shadow-xs'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-muted-foreground">{res.id}</span>
                    <StatusBadge status={res.status} showIcon={false} />
                  </div>
                  <p className="font-bold text-foreground text-sm truncate">{res.name}</p>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    {res.category} • ₹{res.rental_price}/{res.price_unit}
                  </p>
                  {hasBookings && (
                    <span className="inline-block text-[10px] text-emerald-800 font-semibold mt-1">
                      ● Active Confirmed Bookings
                    </span>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Availability Form & Existing Bookings Column */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    Configure: {selectedResource?.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Update availability window for this physical unit
                  </CardDescription>
                </div>
                <StatusBadge status={status} />
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="status">Availability Status *</Label>
                  <Select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ResourceStatus)}
                  >
                    <option value="Available">Available (Accept new matches)</option>
                    <option value="Currently Booked">Currently Booked</option>
                    <option value="Under Maintenance">Under Maintenance (Temporarily pause)</option>
                    <option value="Broken Down">Broken Down (Requires repair)</option>
                    <option value="Unavailable">Unavailable / Off-season</option>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="from">Season Available From *</Label>
                    <Input
                      id="from"
                      type="date"
                      value={availableFrom}
                      onChange={(e) => setAvailableFrom(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="to">Season Available Until *</Label>
                    <Input
                      id="to"
                      type="date"
                      value={availableTo}
                      onChange={(e) => setAvailableTo(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="opStart">Operating Hours: Start</Label>
                    <Input
                      id="opStart"
                      type="time"
                      value={operatingStart}
                      onChange={(e) => setOperatingStart(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="opEnd">Operating Hours: End</Label>
                    <Input
                      id="opEnd"
                      type="time"
                      value={operatingEnd}
                      onChange={(e) => setOperatingEnd(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-farm-green hover:bg-farm-green-dark text-white font-semibold"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Availability Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Existing Bookings for this resource */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground">
                Confirmed Bookings on {selectedResource?.name} ({resourceBookings.length})
              </CardTitle>
              <CardDescription className="text-xs">
                These reservation intervals are locked to guarantee no double-booking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {resourceBookings.length === 0 ? (
                <div className="p-4 rounded-lg bg-stone-50 border border-dashed border-border text-center text-xs text-muted-foreground">
                  No active reservations. This unit is open for candidate slot matching.
                </div>
              ) : (
                resourceBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/40 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-950">{b.id}</span>
                        <StatusBadge status={b.status} />
                      </div>
                      <span className="font-bold text-emerald-900">
                        Farmer: {b.farmer_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-semibold pt-1">
                      <Clock className="w-3.5 h-3.5 text-farm-green" />
                      <span>{b.start_at.replace('T', ' ')} — {b.end_at.replace('T', ' ')}</span>
                    </div>
                    <p className="text-muted-foreground">
                      Crop: {b.crop_name} ({b.land_area_acres} Acres) • Transit allowance: {b.buffer_minutes}m buffer
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
