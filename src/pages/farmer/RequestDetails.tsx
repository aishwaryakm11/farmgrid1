import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { requestService } from '@/services/requestService';
import { ResourceRequest } from '@/types/request';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  XCircle,
  MapPin,
  Calendar,
  AlertTriangle,
  Tractor,
  Layers,
  ArrowRight,
  ShieldCheck,
  Info,
} from 'lucide-react';

export const RequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [request, setRequest] = useState<ResourceRequest | undefined>(() =>
    id ? requestService.getById(id) : undefined
  );
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    if (id) {
      setRequest(requestService.getById(id));
    }
  }, [id]);

  if (!request) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-xl font-bold">Request Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested ID does not exist in your records.</p>
        <Button onClick={() => navigate('/farmer/my-requests')}>Back to Requests</Button>
      </div>
    );
  }

  const handleCancel = () => {
    requestService.cancelRequest(request.id, 'Cancelled by farmer via Request Details.');
    setRequest(requestService.getById(request.id));
    setShowCancelDialog(false);
  };

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

  const isCancellable = ['Pending', 'Scheduled', 'Waiting'].includes(request.status);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/farmer/my-requests')}
          className="text-xs p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to My Requests
        </Button>
      </div>

      {/* Header */}
      <PageHeader
        title={`Request Details: ${request.id}`}
        description={`Submitted on ${formatDate(request.submitted_at)} for ${request.crop_name} (${request.land_area_acres} Acres)`}
        badge={<StatusBadge status={request.status} />}
        action={
          <div className="flex items-center gap-2">
            {request.status === 'Scheduled' && (
              <Button
                size="sm"
                onClick={() => navigate('/farmer/allocations')}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs"
              >
                <CalendarCheck className="w-3.5 h-3.5 mr-1.5" />
                View Full Allocation
              </Button>
            )}
            {isCancellable && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancelDialog(true)}
                className="text-destructive border-destructive/30 hover:bg-destructive/10 text-xs"
              >
                <XCircle className="w-3.5 h-3.5 mr-1.5" />
                Cancel Request
              </Button>
            )}
          </div>
        }
      />

      {/* Scheduled Allocation Banner (If Scheduled) */}
      {request.status === 'Scheduled' && request.allocation_details && (
        <Card className="border-emerald-300 bg-emerald-50/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CalendarCheck className="w-5 h-5 text-farm-green" />
                <span>Confirmed Reservation & Assigned Unit</span>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                Ref: {request.allocation_details.booking_id}
              </span>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid sm:grid-cols-3 gap-4 pt-1">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Assigned Equipment</p>
                <p className="font-bold text-foreground text-base">
                  {request.allocation_details.resource_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Owner: {request.allocation_details.owner_name} • {request.allocation_details.depot_location}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Confirmed Window</p>
                <p className="font-semibold text-foreground">
                  {formatDate(request.allocation_details.start_at)} — {formatDate(request.allocation_details.end_at)}
                </p>
                <p className="text-xs text-emerald-800 font-medium">
                  Includes {request.allocation_details.buffer_minutes}m buffer + {request.allocation_details.travel_minutes}m travel
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase font-medium">Operator Readiness</p>
                <p className="font-semibold text-foreground">
                  {request.allocation_details.operator_included ? 'Dedicated Operator Included' : 'Self-Operated'}
                </p>
                <p className="text-xs text-emerald-800 font-medium">Conflict-Free Lock Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Waiting Queue Banner (If Waiting) */}
      {request.status === 'Waiting' && (
        <Card className="border-blue-200 bg-blue-50/40">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <Clock className="w-5 h-5 text-blue-700" />
              <span>Queue Status: In Priority Waitlist</span>
            </div>
          </CardHeader>
          <CardContent className="text-xs text-blue-950 space-y-2">
            <p>
              Your request scored <strong>{request.priority_score || 61}/100</strong> and is queued for matching. Currently, compatible physical machinery is undergoing scheduled service or committed to a critical-harvest window.
            </p>
            <div className="p-3 bg-white rounded-lg border border-blue-200 font-medium text-foreground">
              <span className="font-bold text-blue-900">Suggested Action:</span> If your crop window allows, widening your required end date by 24 hours will open candidate slots with alternative nearby depots.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submitted Request Parameters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Submitted Request Parameters</CardTitle>
          <CardDescription className="text-xs">
            Farmer-provided crop conditions and scheduling requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-border">
            <div>
              <span className="text-xs text-muted-foreground uppercase font-medium">Resource Type</span>
              <p className="font-semibold text-foreground mt-0.5">{request.resource_type}</p>
              <span className="text-xs text-muted-foreground">Category: {request.category}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase font-medium">Crop & Acreage</span>
              <p className="font-semibold text-foreground mt-0.5">{request.crop_name}</p>
              <span className="text-xs text-muted-foreground">{request.land_area_acres} Acres</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase font-medium">Crop Biological Stage</span>
              <p className="font-semibold text-foreground mt-0.5">{request.crop_stage}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase font-medium">Required Duration</span>
              <p className="font-semibold text-foreground mt-0.5">{request.duration_hours} Hours</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-border">
            <div>
              <span className="text-xs text-muted-foreground uppercase font-medium">Requested Time Window</span>
              <p className="font-medium text-foreground mt-0.5">
                From: {formatDate(request.earliest_start)}
              </p>
              <p className="font-medium text-foreground">
                To: {formatDate(request.latest_end)}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase font-medium">Farm Village / Location</span>
              <p className="font-medium text-foreground mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-farm-green shrink-0" />
                <span>{request.farm_location}</span>
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pb-4 border-b border-border">
            <span className="text-xs text-muted-foreground uppercase font-medium">
              Urgency Level: <strong className="text-foreground">{request.urgency_level}</strong>
            </span>
            <p className="text-xs bg-muted/40 p-3 rounded-lg border border-border text-foreground leading-relaxed">
              "{request.urgency_reason}"
            </p>
          </div>

          {request.additional_notes && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase font-medium">Additional Notes & Access Constraints</span>
              <p className="text-xs text-muted-foreground">{request.additional_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Six-Factor Priority Score Breakdown (When Available) */}
      {request.priority_breakdown ? (
        <Card className="border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base">
                  Deterministic Priority Score: {request.priority_breakdown.total_score} / 100
                </CardTitle>
                <CardDescription className="text-xs">
                  Transparent mathematical formula. No opaque AI prediction used.
                </CardDescription>
              </div>
              <span className="text-2xl font-black text-farm-green px-3 py-1 bg-farm-sage rounded-lg self-start sm:self-auto">
                {request.priority_breakdown.total_score} / 100
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="text-xs text-muted-foreground">1. Urgency Proximity</span>
                <p className="text-base font-bold text-foreground mt-0.5">
                  {request.priority_breakdown.urgency_score} <span className="text-xs font-normal text-muted-foreground">/ 25</span>
                </p>
                <p className="text-[11px] text-muted-foreground">Critically narrow deadline</p>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="text-xs text-muted-foreground">2. Weather Risk (Simulated)</span>
                <p className="text-base font-bold text-foreground mt-0.5">
                  {request.priority_breakdown.weather_score} <span className="text-xs font-normal text-muted-foreground">/ 25</span>
                </p>
                <p className="text-[11px] text-amber-700 font-medium">Rain/storm threat window</p>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="text-xs text-muted-foreground">3. Crop Readiness Stage</span>
                <p className="text-base font-bold text-foreground mt-0.5">
                  {request.priority_breakdown.crop_stage_score} <span className="text-xs font-normal text-muted-foreground">/ 20</span>
                </p>
                <p className="text-[11px] text-muted-foreground">Biological vulnerability</p>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="text-xs text-muted-foreground">4. Queue Waiting Time</span>
                <p className="text-base font-bold text-foreground mt-0.5">
                  {request.priority_breakdown.waiting_score} <span className="text-xs font-normal text-muted-foreground">/ 15</span>
                </p>
                <p className="text-[11px] text-muted-foreground">Fair queue seniority</p>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="text-xs text-muted-foreground">5. Distance & Logistics (Simulated)</span>
                <p className="text-base font-bold text-foreground mt-0.5">
                  {request.priority_breakdown.logistics_score} <span className="text-xs font-normal text-muted-foreground">/ 10</span>
                </p>
                <p className="text-[11px] text-muted-foreground">Low transit overhead</p>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card">
                <span className="text-xs text-muted-foreground">6. Resource Constraints</span>
                <p className="text-base font-bold text-foreground mt-0.5">
                  {request.priority_breakdown.constraint_score} <span className="text-xs font-normal text-muted-foreground">/ 5</span>
                </p>
                <p className="text-[11px] text-muted-foreground">Operator & fuel ready</p>
              </div>
            </div>

            {/* Plain-Language Explanation */}
            <div className="p-4 rounded-lg bg-farm-sand border border-border space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-farm-green-dark">
                <Sparkles className="w-4 h-4 text-farm-green" />
                <span>Plain-Language Decision Explanation</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-foreground">
                "{request.priority_breakdown.explanation}"
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border">
          <CardContent className="p-6 text-center text-muted-foreground text-xs space-y-2">
            <Sparkles className="w-6 h-6 text-amber-600 mx-auto" />
            <p className="font-semibold text-foreground text-sm">Deterministic Scoring In Progress</p>
            <p className="max-w-md mx-auto">
              This request is currently in <strong>{request.status}</strong> status. The priority score and 6-factor itemization will be recorded during the next batch allocation run.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lifecycle Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Request Status Timeline</CardTitle>
          <CardDescription className="text-xs">
            Auditable history of status transitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 relative pl-6 border-l-2 border-farm-sage ml-2">
            {(request.status_history || [
              { status: request.status, timestamp: request.submitted_at, note: 'Submitted by farmer.' },
            ]).map((step, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-farm-green border-2 border-white" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={step.status} />
                    <span className="text-xs text-muted-foreground">{formatDate(step.timestamp)}</span>
                  </div>
                  <p className="text-xs text-foreground mt-1">{step.note}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cancellation Dialog */}
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Resource Request"
        description="Are you sure you want to cancel this request? Any assigned time slot will be immediately returned to the regional pool for waiting farmers."
        confirmLabel="Yes, Cancel Request"
        variant="destructive"
        onConfirm={handleCancel}
      />
    </div>
  );
};
