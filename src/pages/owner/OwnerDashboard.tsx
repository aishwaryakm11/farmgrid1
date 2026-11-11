import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { resourceService } from '@/services/resourceService';
import { bookingService } from '@/services/bookingService';
import { disruptionService } from '@/services/disruptionService';
import { notificationService } from '@/services/notificationService';
import { Resource } from '@/types/resource';
import { Booking } from '@/types/booking';
import { DisruptionRecord } from '@/types/allocation';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
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
  Tractor,
  CalendarCheck,
  Wrench,
  AlertOctagon,
  Clock,
  PlusCircle,
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Bell,
  MapPin,
} from 'lucide-react';

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const ownerId = user?.id || 'owner-201';

  const [resources, setResources] = useState<Resource[]>(() =>
    resourceService.getAll(ownerId)
  );
  const [stats, setStats] = useState(() => resourceService.getOwnerStats(ownerId));
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>(() =>
    bookingService.getUpcomingBookings(ownerId)
  );
  const [disruptions, setDisruptions] = useState<DisruptionRecord[]>(() =>
    disruptionService.getByOwner(ownerId)
  );
  const [unreadNotifications, setUnreadNotifications] = useState(() =>
    notificationService.getUnreadCount(ownerId)
  );

  const loadData = () => {
    setResources(resourceService.getAll(ownerId));
    setStats(resourceService.getOwnerStats(ownerId));
    setUpcomingBookings(bookingService.getUpcomingBookings(ownerId));
    setDisruptions(disruptionService.getByOwner(ownerId));
    setUnreadNotifications(notificationService.getUnreadCount(ownerId));
  };

  useEffect(() => {
    loadData();

    const handleResUpdate = () => loadData();
    const handleBookUpdate = () => loadData();
    const handleDisruptUpdate = () => loadData();
    const handleNotifUpdate = () => {
      setUnreadNotifications(notificationService.getUnreadCount(ownerId));
    };

    window.addEventListener('farmgrid_resources_updated', handleResUpdate);
    window.addEventListener('farmgrid_bookings_updated', handleBookUpdate);
    window.addEventListener('farmgrid_disruptions_updated', handleDisruptUpdate);
    window.addEventListener('farmgrid_notifications_updated', handleNotifUpdate);

    return () => {
      window.removeEventListener('farmgrid_resources_updated', handleResUpdate);
      window.removeEventListener('farmgrid_bookings_updated', handleBookUpdate);
      window.removeEventListener('farmgrid_disruptions_updated', handleDisruptUpdate);
      window.removeEventListener('farmgrid_notifications_updated', handleNotifUpdate);
    };
  }, [ownerId]);

  // Check if any resource has an active disruption or maintenance status
  const activeDisruption = disruptions.find((d) => d.status === 'Active');
  const maintenanceCount = resources.filter(
    (r) => r.status === 'Under Maintenance' || r.status === 'Broken Down'
  ).length;

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
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`Equipment Fleet — ${user?.full_name?.split(' ')[0] || 'Owner'}`}
        description={`Depot: ${user?.village || 'Shirwal Agro Hub'}. Manage equipment registrations, track scheduled bookings, and monitor availability.`}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/owner/notifications')}
              className="relative"
            >
              <Bell className="w-4 h-4 mr-1.5 text-muted-foreground" />
              Alerts
              {unreadNotifications > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold">
                  {unreadNotifications}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/owner/disruption')}
              className="border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100"
            >
              <AlertOctagon className="w-4 h-4 mr-1.5 text-amber-700" />
              Report Disruption
            </Button>
            <Button
              onClick={() => navigate('/owner/add-resource')}
              className="bg-farm-green hover:bg-farm-green-dark text-white font-semibold shadow-sm"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </div>
        }
      />

      {/* Disruption Alert Notice (If active) */}
      {activeDisruption && (
        <div className="p-4 rounded-lg border border-amber-300 bg-amber-50/90 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <p className="font-bold text-sm">
                Active Disruption: {activeDisruption.resource_name} ({activeDisruption.disruption_type})
              </p>
              <p className="text-amber-900 leading-normal">
                {activeDisruption.description} • Window: {activeDisruption.starts_at.replace('T', ' ')} to {activeDisruption.ends_at.replace('T', ' ')}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/owner/disruption')}
            className="text-xs bg-white text-amber-950 border-amber-300 shrink-0 self-start sm:self-auto"
          >
            Review Disruption Log →
          </Button>
        </div>
      )}

      {/* KPI Cards as requested in Task A */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Registered Resources"
          value={stats.total}
          icon={Tractor}
          subtext="Physical units in fleet"
        />
        <StatCard
          label="Available Resources"
          value={stats.available}
          icon={CheckCircle2}
          variant="success"
          subtext="Ready for matching"
        />
        <StatCard
          label="Currently Booked"
          value={stats.booked}
          icon={CalendarCheck}
          variant="default"
          subtext="Active reservation slots"
        />
        <StatCard
          label="Unavailable Resources"
          value={stats.unavailable}
          icon={Wrench}
          variant="warning"
          subtext={`${maintenanceCount} in maintenance / breakdown`}
        />
      </div>

      {/* Registered Fleet Overview Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg">Registered Equipment Fleet</CardTitle>
            <CardDescription className="text-xs">
              Machinery and service teams available for automated, conflict-free farmer matching
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/owner/availability')}
            >
              Manage Availability
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/owner/resources')}
            >
              View All ({resources.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource ID</TableHead>
                <TableHead>Machine / Team Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rental Rate</TableHead>
                <TableHead>Depot Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((res) => (
                <TableRow key={res.id}>
                  <TableCell className="font-mono text-xs font-semibold">{res.id}</TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {res.name}
                    <span className="block text-[11px] font-normal text-muted-foreground">
                      {res.specs_json?.capacity || res.resource_type}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">{res.category}</TableCell>
                  <TableCell className="text-xs font-semibold text-foreground">
                    ₹{res.rental_price.toLocaleString()} / {res.price_unit}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {res.location_text}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={res.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/owner/resource/${res.id}`)}
                        className="text-xs text-farm-green hover:text-farm-green-dark"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/owner/edit-resource/${res.id}`)}
                        className="text-xs"
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upcoming Confirmed Bookings Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg">Upcoming Confirmed Bookings</CardTitle>
            <CardDescription className="text-xs">
              Automated reservations generated by FarmGrid allocation engine
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/owner/bookings')}
          >
            All Bookings ({upcomingBookings.length})
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {upcomingBookings.length === 0 ? (
            <EmptyState
              title="No upcoming confirmed bookings"
              description="New booking assignments will appear as soon as the deterministic allocation engine evaluates pending requests."
              icon={CalendarCheck}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Resource Assigned</TableHead>
                  <TableHead>Farmer & Crop</TableHead>
                  <TableHead>Scheduled Window</TableHead>
                  <TableHead>Transit Buffer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingBookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs font-semibold">{b.id}</TableCell>
                    <TableCell className="font-semibold text-foreground">
                      {b.resource_name}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-xs text-foreground">{b.farmer_name}</span>
                      <span className="block text-[11px] text-muted-foreground">
                        {b.crop_name} • {b.farmer_village}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-foreground">
                      {formatDateRange(b.start_at, b.end_at)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {b.buffer_minutes}m buffer ({b.travel_minutes}m road travel)
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={b.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/owner/calendar')}
                        className="text-xs text-farm-green hover:text-farm-green-dark"
                      >
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        Calendar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent Activities Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Fleet Activity</CardTitle>
          <CardDescription className="text-xs">
            Operational events, dispatch schedule locks, and maintenance logs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-emerald-950">Booking Confirmed: Combine Harvester H-02</span>
              <p className="text-emerald-900 mt-0.5">
                Farmer Ramesh Patel assigned for Soybean harvest on 14 June, 07:00 — 13:00 (Ref: BK-9042). 45-minute travel buffer locked.
              </p>
              <span className="text-[11px] text-emerald-800/70 mt-1 block">4 hours ago</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/50 border border-amber-200 text-xs">
            <Wrench className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-amber-950">Maintenance Active: Kirloskar 10HP Pump</span>
              <p className="text-amber-900 mt-0.5">
                Impeller seal overhaul scheduled through 16 June. Allocation engine has paused matching for candidate slots.
              </p>
              <span className="text-[11px] text-amber-800/70 mt-1 block">1 day ago</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-stone-50 border border-border text-xs">
            <CalendarCheck className="w-4 h-4 text-farm-green shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-foreground">Booking Completed: Mahindra 575 DI Tractor</span>
              <p className="text-muted-foreground mt-0.5">
                Pre-sowing tillage completed successfully on Plot 14 (Ref: BK-8901). Machine returned to Shirwal Depot.
              </p>
              <span className="text-[11px] text-muted-foreground mt-1 block">05 June 2026</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
