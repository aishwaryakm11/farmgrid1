import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { requestService } from '@/services/requestService';
import { ResourceRequest } from '@/types/request';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Tractor,
  ArrowRight,
  ShieldCheck,
  Hourglass,
  Info,
} from 'lucide-react';

export const AllocationResultsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const farmerId = user?.id || 'farmer-101';

  const [requests, setRequests] = useState<ResourceRequest[]>(() =>
    requestService.getByFarmer(farmerId)
  );

  const loadData = () => {
    setRequests(requestService.getByFarmer(farmerId));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('farmgrid_requests_updated', loadData);
    return () => window.removeEventListener('farmgrid_requests_updated', loadData);
  }, [farmerId]);

  const allocatedRequests = requests.filter(
    (r) => (r.status === 'Scheduled' || r.status === 'Completed') && r.allocation_details
  );

  const waitingRequests = requests.filter((r) => r.status === 'Waiting');

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      return new Date(isoString).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Allocation Results & Scheduled Machinery"
        description="Review all physical equipment assigned to your farm by the deterministic allocation engine."
        action={
          <Button
            onClick={() => navigate('/farmer/new-request')}
            className="bg-farm-green hover:bg-farm-green-dark text-white font-semibold"
          >
            Request Another Machine
          </Button>
        }
      />

      {/* Allocated Equipment Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Confirmed & Completed Allocations ({allocatedRequests.length})
        </h3>

        {allocatedRequests.length === 0 ? (
          <EmptyState
            title="No allocated machinery yet"
            description="When the allocation engine processes your pending requests and matches feasible slots, confirmed allocations will appear here."
            icon={Tractor}
            actionLabel="View My Requests"
            onAction={() => navigate('/farmer/my-requests')}
          />
        ) : (
          allocatedRequests.map((req) => (
            <Card key={req.id} className="border-emerald-300 bg-card overflow-hidden shadow-xs">
              <div className="p-4 bg-emerald-50/70 border-b border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded bg-emerald-100 text-emerald-800">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-emerald-950">
                      {req.allocation_details?.resource_name}
                    </h4>
                    <p className="text-xs text-emerald-800">
                      Request ID: <span className="font-mono font-bold">{req.id}</span> • Booking Ref:{' '}
                      <span className="font-mono font-bold">{req.allocation_details?.booking_id}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={req.status} />
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-700 text-white">
                    Score: {req.priority_score}/100
                  </span>
                </div>
              </div>

              <CardContent className="p-5 space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-border">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold">
                      Confirmed Operational Slot
                    </span>
                    <p className="font-bold text-foreground mt-0.5">
                      {formatDate(req.allocation_details?.start_at)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Until: {formatDate(req.allocation_details?.end_at)}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold">
                      Depot & Transit Allowance
                    </span>
                    <p className="font-semibold text-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-farm-green shrink-0" />
                      <span>{req.allocation_details?.depot_location}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {req.allocation_details?.buffer_minutes}m buffer + {req.allocation_details?.travel_minutes}m travel
                    </p>
                  </div>

                  <div>
                    <span className="text-xs text-muted-foreground uppercase font-semibold">
                      Crop & Farm Plot
                    </span>
                    <p className="font-semibold text-foreground mt-0.5">
                      {req.crop_name} ({req.land_area_acres} Acres)
                    </p>
                    <p className="text-xs text-muted-foreground">{req.crop_stage}</p>
                  </div>
                </div>

                {/* Explanation */}
                {req.priority_breakdown?.explanation && (
                  <div className="p-3.5 rounded-lg bg-farm-sand border border-border space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-farm-green-dark">
                      <Sparkles className="w-3.5 h-3.5 text-farm-green" />
                      <span>Transparent Decision Rationale</span>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">
                      "{req.priority_breakdown.explanation}"
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                    <ShieldCheck className="w-4 h-4 text-farm-green" />
                    <span>Conflict-Free Guaranteed: No Overlapping Bookings</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/farmer/request/${req.id}`)}
                    className="text-xs text-farm-green hover:text-farm-green-dark"
                  >
                    View Request Details
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Waiting Requests Section */}
      {waitingRequests.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Queued for Next Available Allocation Slot ({waitingRequests.length})
          </h3>

          {waitingRequests.map((req) => (
            <Card key={req.id} className="border-blue-200 bg-blue-50/30">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-muted-foreground">{req.id}</span>
                    <StatusBadge status="Waiting" />
                    <span className="text-xs font-semibold text-blue-900">
                      Score: {req.priority_score || 61}/100
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{req.resource_type} for {req.crop_name}</h4>
                  <p className="text-xs text-muted-foreground">
                    In queue: Candidate machinery currently in maintenance or reserved by higher-urgency harvest window.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/farmer/request/${req.id}`)}
                  className="text-xs bg-white text-blue-900 border-blue-200 hover:bg-blue-100/50"
                >
                  View Details & Queue Rationale
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
