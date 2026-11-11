import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Edit,
  Wrench,
  AlertOctagon,
  CalendarCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Sliders,
} from 'lucide-react';

export const ResourceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [resource, setResource] = useState<Resource | undefined>(() =>
    id ? resourceService.getById(id) : undefined
  );
  const [bookings, setBookings] = useState<Booking[]>(() =>
    id ? bookingService.getByResource(id) : []
  );
  const [disruptions, setDisruptions] = useState<DisruptionRecord[]>(() =>
    id ? disruptionService.getAll().filter((d) => d.resource_id === id) : []
  );

  useEffect(() => {
    if (id) {
      setResource(resourceService.getById(id));
      setBookings(bookingService.getByResource(id));
      setDisruptions(disruptionService.getAll().filter((d) => d.resource_id === id));
    }
  }, [id]);

  if (!resource) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-xl font-bold">Resource Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested resource could not be found.</p>
        <Button onClick={() => navigate('/owner/resources')}>Back to Resources</Button>
      </div>
    );
  }

  const formatDateRange = (start: string, end: string) => {
    try {
      const s = new Date(start);
      const e = new Date(end);
      return `${s.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — ${e.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return `${start} — ${end}`;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/owner/resources')}
          className="text-xs p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to My Resources
        </Button>
      </div>

      <PageHeader
        title={resource.name}
        description={`Hardware ID: ${resource.id} • Registered in category: ${resource.category}`}
        badge={<StatusBadge status={resource.status} />}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/owner/availability`)}
              className="text-xs"
            >
              <Sliders className="w-3.5 h-3.5 mr-1.5" />
              Manage Availability
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/owner/disruption`)}
              className="border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 text-xs"
            >
              <AlertOctagon className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
              Report Disruption
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(`/owner/edit-resource/${resource.id}`)}
              className="bg-farm-green hover:bg-farm-green-dark text-white font-semibold text-xs"
            >
              <Edit className="w-3.5 h-3.5 mr-1.5" />
              Edit Resource
            </Button>
          </div>
        }
      />

      {/* Specifications & Rental Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Technical Specifications & Rental Terms</CardTitle>
          <CardDescription className="text-xs">
            Physical dimensions, horsepower, fuel coverage, and depot storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-border">
            <div>
              <span className="text-xs text-muted-foreground uppercase font-semibold">Category</span>
              <p className="font-bold text-foreground mt-0.5">{resource.category}</p>
              <span className="text-xs text-muted-foreground">{resource.resource_type}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase font-semibold">Rental Rate</span>
              <p className="font-bold text-emerald-800 text-base mt-0.5">
                ₹{resource.rental_price.toLocaleString()} / {resource.price_unit}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase font-semibold">Output / Capacity</span>
              <p className="font-semibold text-foreground mt-0.5">
                {resource.specs_json?.capacity || 'Standard'}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase font-semibold">Operator</span>
              <p className="font-semibold text-foreground mt-0.5">
                {resource.specs_json?.operator ? 'Included with Machine' : 'Self-operated'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-border">
            <div>
              <span className="text-xs text-muted-foreground uppercase font-semibold">Base Depot Location</span>
              <p className="font-medium text-foreground mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-farm-green shrink-0" />
                <span>{resource.location_text}</span>
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase font-semibold">Operating Window</span>
              <p className="font-medium text-foreground mt-0.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-farm-green shrink-0" />
                <span>
                  {resource.operating_start || '06:00'} — {resource.operating_end || '18:00'} Daily
                </span>
              </p>
              <span className="text-xs text-muted-foreground">
                Season: {resource.available_from || '2026-06-01'} to {resource.available_to || '2026-07-31'}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground uppercase font-semibold">Description</span>
            <p className="text-xs text-foreground leading-relaxed">
              {resource.description || 'No detailed description provided.'}
            </p>
          </div>

          {resource.specs_json?.attachments && resource.specs_json.attachments.length > 0 && (
            <div className="pt-2">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Attachments Included:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {resource.specs_json.attachments.map((att, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-md bg-muted text-foreground text-xs font-medium"
                  >
                    {att}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bookings associated with this resource */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base">Assigned Bookings for this Unit</CardTitle>
            <CardDescription className="text-xs">
              Reservations scheduled for this specific machine
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/owner/calendar')}
            className="text-xs"
          >
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Calendar View
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {bookings.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No confirmed bookings currently assigned to this resource.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Crop & Location</TableHead>
                  <TableHead>Scheduled Window</TableHead>
                  <TableHead>Buffer</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs font-semibold">{b.id}</TableCell>
                    <TableCell className="font-semibold text-foreground">{b.farmer_name}</TableCell>
                    <TableCell className="text-xs">
                      {b.crop_name} • {b.farmer_village}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {formatDateRange(b.start_at, b.end_at)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{b.buffer_minutes}m buffer</TableCell>
                    <TableCell>
                      <StatusBadge status={b.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Disruption / Maintenance History */}
      {disruptions.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-amber-700" />
              <CardTitle className="text-base text-amber-950">Maintenance & Disruption History</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Window</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disruptions.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-mono text-xs font-semibold">{d.id}</TableCell>
                    <TableCell className="font-semibold text-xs">{d.disruption_type}</TableCell>
                    <TableCell className="text-xs text-foreground max-w-xs truncate">{d.description}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {d.starts_at.replace('T', ' ')} — {d.ends_at.replace('T', ' ')}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={d.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
