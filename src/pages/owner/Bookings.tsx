import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services/bookingService';
import { Booking } from '@/types/booking';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  CalendarCheck,
  Search,
  Filter,
  Clock,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const ownerId = user?.id || 'owner-201';

  const [bookings, setBookings] = useState<Booking[]>(() =>
    bookingService.getByOwner(ownerId)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const loadBookings = () => {
    setBookings(bookingService.getByOwner(ownerId));
  };

  useEffect(() => {
    loadBookings();
    window.addEventListener('farmgrid_bookings_updated', loadBookings);
    return () => window.removeEventListener('farmgrid_bookings_updated', loadBookings);
  }, [ownerId]);

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.resource_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.crop_name && b.crop_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
        title="Fleet Reservations & Bookings"
        description="All confirmed farmer reservations scheduled for your machinery by the deterministic allocation engine."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/owner/calendar')}
          >
            <Calendar className="w-4 h-4 mr-1.5" />
            Calendar View
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Booking ID, farmer, or resource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Booking Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Disrupted">Disrupted</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState
              title="No bookings match criteria"
              description="No reservation records match your active search terms or filters."
              icon={CalendarCheck}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Assigned Resource</TableHead>
                  <TableHead>Farmer Information</TableHead>
                  <TableHead>Crop & Acreage</TableHead>
                  <TableHead>Scheduled Window</TableHead>
                  <TableHead>Priority Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs font-semibold text-foreground">
                      {b.id}
                      <span className="block text-[10px] text-muted-foreground font-normal">
                        Req: {b.request_id}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-foreground">
                      {b.resource_name}
                      <span className="block text-[11px] font-normal text-muted-foreground">
                        {b.resource_category || 'Machinery'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-xs text-foreground">{b.farmer_name}</span>
                      <span className="block text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-farm-green shrink-0" />
                        {b.farmer_village}
                      </span>
                      {b.farmer_phone && (
                        <span className="block text-[10px] text-muted-foreground font-mono">
                          {b.farmer_phone}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="font-semibold text-foreground">{b.crop_name}</span>
                      <span className="block text-muted-foreground">
                        {b.land_area_acres} Acres • {b.crop_stage}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      <p className="font-semibold text-foreground">
                        {formatDate(b.start_at)}
                      </p>
                      <p className="text-muted-foreground">
                        To: {formatDate(b.end_at)}
                      </p>
                      <span className="text-[11px] text-emerald-800 font-medium">
                        {b.buffer_minutes}m buffer included
                      </span>
                    </TableCell>
                    <TableCell>
                      {b.priority_score ? (
                        <div className="flex items-center gap-1 font-bold text-sm text-farm-green-dark">
                          <span>{b.priority_score}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">/100</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
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
    </div>
  );
};
