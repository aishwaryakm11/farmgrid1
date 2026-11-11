import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { resourceService } from '@/services/resourceService';
import { bookingService } from '@/services/bookingService';
import { disruptionService } from '@/services/disruptionService';
import { Resource } from '@/types/resource';
import { Booking } from '@/types/booking';
import { DisruptionRecord } from '@/types/allocation';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Wrench,
  AlertOctagon,
  CalendarCheck,
  MapPin,
  ShieldCheck,
  Info,
} from 'lucide-react';

export const OwnerCalendarPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const ownerId = user?.id || 'owner-201';

  const [resources, setResources] = useState<Resource[]>(() =>
    resourceService.getAll(ownerId)
  );
  const [selectedResourceId, setSelectedResourceId] = useState<string>('All');
  const [bookings, setBookings] = useState<Booking[]>(() =>
    bookingService.getByOwner(ownerId)
  );
  const [disruptions, setDisruptions] = useState<DisruptionRecord[]>(() =>
    disruptionService.getByOwner(ownerId)
  );

  const [viewMode, setViewMode] = useState<'schedule' | 'timeline'>('schedule');

  const loadData = () => {
    setResources(resourceService.getAll(ownerId));
    setBookings(bookingService.getByOwner(ownerId));
    setDisruptions(disruptionService.getByOwner(ownerId));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('farmgrid_resources_updated', loadData);
    window.addEventListener('farmgrid_bookings_updated', loadData);
    window.addEventListener('farmgrid_disruptions_updated', loadData);

    return () => {
      window.removeEventListener('farmgrid_resources_updated', loadData);
      window.removeEventListener('farmgrid_bookings_updated', loadData);
      window.removeEventListener('farmgrid_disruptions_updated', loadData);
    };
  }, [ownerId]);

  // Aggregate schedule events (Bookings + Disruptions + Maintenance)
  interface CalendarEvent {
    id: string;
    resource_id: string;
    resource_name: string;
    title: string;
    type: 'booking' | 'maintenance' | 'breakdown' | 'available';
    start_time: string;
    end_time: string;
    status: string;
    details: string;
    transit_buffer?: string;
  }

  const events: CalendarEvent[] = [];

  bookings.forEach((b) => {
    events.push({
      id: b.id,
      resource_id: b.resource_id,
      resource_name: b.resource_name,
      title: `Booking: ${b.farmer_name} (${b.crop_name || 'Crop'})`,
      type: 'booking',
      start_time: b.start_at,
      end_time: b.end_at,
      status: b.status,
      details: `Village: ${b.farmer_village || 'Pune'} • ${b.duration_hours || 6} hours`,
      transit_buffer: `${b.buffer_minutes}m buffer (${b.travel_minutes}m travel)`,
    });
  });

  disruptions.forEach((d) => {
    events.push({
      id: d.id,
      resource_id: d.resource_id,
      resource_name: d.resource_name,
      title: `${d.disruption_type}: ${d.resource_name}`,
      type: d.disruption_type === 'Breakdown' ? 'breakdown' : 'maintenance',
      start_time: d.starts_at,
      end_time: d.ends_at,
      status: d.status === 'Active' ? 'Under Maintenance' : 'Resolved',
      details: d.description,
    });
  });

  // Filter events
  const filteredEvents = events.filter((e) =>
    selectedResourceId === 'All' ? true : e.resource_id === selectedResourceId
  );

  // Sort events chronologically
  filteredEvents.sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fleet Scheduling Calendar"
        description="Comprehensive timeline showing available periods, confirmed bookings, and maintenance intervals across your machinery."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/owner/disruption')}
              className="border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 text-xs"
            >
              <AlertOctagon className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
              Report Disruption
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/owner/availability')}
              className="bg-farm-green hover:bg-farm-green-dark text-white font-semibold text-xs"
            >
              Configure Availability
            </Button>
          </div>
        }
      />

      {/* Filter and Date Navigation Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 border border-border rounded-md px-1 bg-muted/40">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs font-bold px-2 text-foreground">
                June 2026 (Active Harvesting Window)
              </span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="hidden sm:flex items-center gap-1 bg-muted p-1 rounded-md text-xs">
              <button
                onClick={() => setViewMode('schedule')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  viewMode === 'schedule' ? 'bg-white shadow-xs font-bold text-foreground' : 'text-muted-foreground'
                }`}
              >
                Schedule List
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  viewMode === 'timeline' ? 'bg-white shadow-xs font-bold text-foreground' : 'text-muted-foreground'
                }`}
              >
                Resource Rows
              </button>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <Select
              value={selectedResourceId}
              onChange={(e) => setSelectedResourceId(e.target.value)}
            >
              <option value="All">All Resources ({resources.length})</option>
              {resources.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.id} — {res.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-border text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500" />
            <span>Confirmed Booking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500" />
            <span>Scheduled Maintenance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500" />
            <span>Mechanical Breakdown</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-500" />
            <span>Available Window</span>
          </div>
          <div className="ml-auto text-farm-green-dark font-medium">
            Strict Non-Overlapping Guarantee Enforced
          </div>
        </div>
      </Card>

      {/* Events View */}
      {viewMode === 'schedule' ? (
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <Card className="p-8 text-center text-xs text-muted-foreground">
              No calendar events found for the selected resource.
            </Card>
          ) : (
            filteredEvents.map((evt) => {
              const isBooking = evt.type === 'booking';
              const isMaintenance = evt.type === 'maintenance';
              const isBreakdown = evt.type === 'breakdown';

              return (
                <Card
                  key={evt.id}
                  className={`overflow-hidden border transition-all ${
                    isBooking
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : isBreakdown
                      ? 'border-rose-300 bg-rose-50/30'
                      : 'border-amber-300 bg-amber-50/30'
                  }`}
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-muted-foreground">
                          {evt.id}
                        </span>
                        <StatusBadge status={evt.status} />
                        <span className="text-xs font-bold text-foreground">
                          {evt.resource_name}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground">{evt.title}</h4>
                      <p className="text-xs text-muted-foreground">{evt.details}</p>
                    </div>

                    <div className="text-left sm:text-right space-y-1 shrink-0">
                      <div className="flex items-center sm:justify-end gap-1.5 text-xs font-bold text-foreground">
                        <Clock className="w-3.5 h-3.5 text-farm-green" />
                        <span>{formatDate(evt.start_time)} — {formatDate(evt.end_time)}</span>
                      </div>
                      {evt.transit_buffer && (
                        <p className="text-[11px] text-emerald-800 font-medium">
                          {evt.transit_buffer}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      ) : (
        /* Resource Rows View */
        <div className="space-y-4">
          {resources
            .filter((r) => selectedResourceId === 'All' || r.id === selectedResourceId)
            .map((res) => {
              const resEvents = events.filter((e) => e.resource_id === res.id);
              return (
                <Card key={res.id} className="overflow-hidden">
                  <div className="p-4 bg-muted/40 border-b border-border flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-foreground">{res.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {res.category} • Depot: {res.location_text}
                      </p>
                    </div>
                    <StatusBadge status={res.status} />
                  </div>

                  <CardContent className="p-4 space-y-2">
                    {resEvents.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-2">
                        No scheduled bookings or active maintenance blocks. Available for matching.
                      </p>
                    ) : (
                      resEvents.map((evt) => (
                        <div
                          key={evt.id}
                          className="p-3 rounded-lg border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="font-semibold text-foreground">{evt.title}</span>
                            <p className="text-muted-foreground">{evt.details}</p>
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                            <span>{formatDate(evt.start_time)} — {formatDate(evt.end_time)}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
};
