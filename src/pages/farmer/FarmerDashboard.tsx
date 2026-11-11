import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { requestService } from '@/services/requestService';
import { notificationService } from '@/services/notificationService';
import { ResourceRequest } from '@/types/request';
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
  PlusCircle,
  Clock,
  CalendarCheck,
  Hourglass,
  CheckCircle2,
  FileText,
  Eye,
  Sparkles,
  Calendar,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Bell,
  MapPin,
  Tractor,
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const farmerId = user?.id || 'farmer-101';
  const [requests, setRequests] = useState<ResourceRequest[]>(() =>
    requestService.getByFarmer(farmerId)
  );
  const [stats, setStats] = useState(() => requestService.getFarmerStats(farmerId));
  const [unreadNotifications, setUnreadNotifications] = useState(() =>
    notificationService.getUnreadCount(farmerId)
  );

  const loadData = () => {
    setRequests(requestService.getByFarmer(farmerId));
    setStats(requestService.getFarmerStats(farmerId));
    setUnreadNotifications(notificationService.getUnreadCount(farmerId));
  };

  useEffect(() => {
    loadData();

    const handleReqUpdate = () => loadData();
    const handleNotifUpdate = () => {
      setUnreadNotifications(notificationService.getUnreadCount(farmerId));
    };

    window.addEventListener('farmgrid_requests_updated', handleReqUpdate);
    window.addEventListener('farmgrid_notifications_updated', handleNotifUpdate);

    return () => {
      window.removeEventListener('farmgrid_requests_updated', handleReqUpdate);
      window.removeEventListener('farmgrid_notifications_updated', handleNotifUpdate);
    };
  }, [farmerId]);

  // Find the primary scheduled upcoming booking
  const upcomingBooking = requests.find(
    (r) => r.status === 'Scheduled' && r.allocation_details
  );

  // Formatted date helper
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
      {/* Welcome & Primary CTA Header */}
      <PageHeader
        title={`Welcome, ${user?.full_name?.split(' ')[0] || 'Farmer'}`}
        description={`Farming operations in ${user?.village || 'Khed Shivapur'} (${user?.farm_size_acres || 12} Acres, ${user?.crop_name || 'Soybean'}). Monitor requests and scheduled machinery.`}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/farmer/notifications')}
              className="relative"
            >
              <Bell className="w-4 h-4 mr-1.5 text-muted-foreground" />
              Notifications
              {unreadNotifications > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold">
                  {unreadNotifications}
                </span>
              )}
            </Button>
            <Button
              onClick={() => navigate('/farmer/new-request')}
              className="bg-farm-green hover:bg-farm-green-dark text-white font-semibold shadow-sm"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              New Resource Request
            </Button>
          </div>
        }
      />

      {/* KPI Summary Cards as specified in Task A */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Requests"
          value={stats.total}
          icon={FileText}
          subtext="Lifetime submissions"
        />
        <StatCard
          label="Pending Requests"
          value={stats.pending}
          icon={Clock}
          variant="warning"
          subtext="Evaluating in queue"
        />
        <StatCard
          label="Approved / Scheduled"
          value={stats.scheduled}
          icon={CalendarCheck}
          variant="success"
          subtext="Guaranteed allocation"
        />
        <StatCard
          label="Completed Bookings"
          value={stats.completed}
          icon={CheckCircle2}
          subtext="Fulfilled operations"
        />
      </div>

      {/* Upcoming Confirmed Booking Section */}
      {upcomingBooking && upcomingBooking.allocation_details && (
        <Card className="border-farm-green/40 bg-gradient-to-r from-farm-sage/30 via-farm-sand to-card shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-md bg-farm-green text-white">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base text-farm-green-dark font-bold">
                    Next Scheduled Agricultural Booking
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Allocated deterministically without overlapping conflicting farm schedules
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={upcomingBooking.status} />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/farmer/allocations')}
                  className="text-xs bg-white hover:bg-farm-sage/50"
                >
                  Allocation Sheet →
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4 pt-1 text-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Equipment Assigned
                </span>
                <p className="font-bold text-foreground">
                  {upcomingBooking.allocation_details.resource_name}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-farm-green shrink-0" />
                  <span>{upcomingBooking.allocation_details.depot_location}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Scheduled Time Slot
                </span>
                <p className="font-bold text-foreground">
                  {formatDateRange(
                    upcomingBooking.allocation_details.start_at,
                    upcomingBooking.allocation_details.end_at
                  )}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-farm-green shrink-0" />
                  <span>
                    Transit Buffer: {upcomingBooking.allocation_details.buffer_minutes} mins road allowance
                  </span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Booking Reference & Operator
                </span>
                <p className="font-mono font-bold text-foreground">
                  {upcomingBooking.allocation_details.booking_id}
                </p>
                <p className="text-xs text-emerald-800 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-farm-green shrink-0" />
                  <span>Operator included with machinery</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resource Request Status Summary Bar */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Resource Request Status Summary</CardTitle>
          <CardDescription className="text-xs">
            Live overview of all your requests across the coordination lifecycle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-lg border border-border bg-stone-50 text-center">
              <span className="text-[11px] text-muted-foreground uppercase font-semibold">Total</span>
              <p className="text-xl font-bold text-foreground mt-0.5">{stats.total}</p>
            </div>
            <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 text-center">
              <span className="text-[11px] text-amber-800 uppercase font-semibold">Pending</span>
              <p className="text-xl font-bold text-amber-900 mt-0.5">{stats.pending}</p>
            </div>
            <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 text-center">
              <span className="text-[11px] text-emerald-800 uppercase font-semibold">Scheduled</span>
              <p className="text-xl font-bold text-emerald-900 mt-0.5">{stats.scheduled}</p>
            </div>
            <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50 text-center">
              <span className="text-[11px] text-blue-800 uppercase font-semibold">Waiting</span>
              <p className="text-xl font-bold text-blue-900 mt-0.5">{stats.waiting}</p>
            </div>
            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] text-stone-700 uppercase font-semibold">Completed</span>
              <p className="text-xl font-bold text-stone-900 mt-0.5">{stats.completed}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Requests Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-lg">Recent Equipment Requests</CardTitle>
            <CardDescription className="text-xs">
              Direct access to request details, priority score breakdowns, and scheduling statuses
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/farmer/my-requests')}
          >
            View All ({requests.length})
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {requests.length === 0 ? (
            <EmptyState
              title="No requests submitted yet"
              description="Submit your first agricultural machinery or labor request to begin coordinated scheduling."
              icon={Tractor}
              actionLabel="Create New Request"
              onAction={() => navigate('/farmer/new-request')}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Resource Type</TableHead>
                  <TableHead>Crop & Area</TableHead>
                  <TableHead>Requested Window</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.slice(0, 5).map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs font-semibold text-foreground">
                      {req.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {req.resource_type}
                      <span className="block text-[11px] text-muted-foreground">
                        {req.duration_hours} hours required
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-xs text-foreground">{req.crop_name}</span>
                      <span className="block text-[11px] text-muted-foreground">
                        {req.land_area_acres} Acres • {req.crop_stage}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateRange(req.earliest_start, req.latest_end)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell>
                      {req.priority_score !== undefined ? (
                        <div className="flex items-center gap-1 font-bold text-sm text-farm-green-dark">
                          <span>{req.priority_score}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">/100</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Pending run</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/farmer/request/${req.id}`)}
                          className="text-xs text-farm-green hover:text-farm-green-dark"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Details
                        </Button>
                      </div>
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
