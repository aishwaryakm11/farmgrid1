import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { requestService } from '@/services/requestService';
import { notificationService } from '@/services/notificationService';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CROP_STAGES } from '@/lib/constants';
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  ArrowRight,
  ClipboardList,
  ShieldAlert,
} from 'lucide-react';
import { UrgencyLevel } from '@/types/request';

const RESOURCE_TYPES = [
  'Tractor',
  'Harvester',
  'Water Pump',
  'Agricultural Labour',
  'Storage',
] as const;

const URGENCY_LEVELS: { level: UrgencyLevel; label: string; desc: string }[] = [
  { level: 'Critical', label: 'Critical / Imminent Crop Loss', desc: 'Harvest deadline within 48h, severe weather threat, or pest breakout' },
  { level: 'High', label: 'High Urgency', desc: 'Time-sensitive biological stage window closing within 3-4 days' },
  { level: 'Moderate', label: 'Moderate Urgency', desc: 'Standard seasonal work needed within 5-7 days' },
  { level: 'Low', label: 'Low Urgency / Flexible', desc: 'Routine off-season preparation or flexible timeframe' },
];

export const NewRequestPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [resourceType, setResourceType] = useState<string>('Harvester');
  const [cropName, setCropName] = useState<string>(user?.crop_name?.split('&')[0]?.trim() || 'Soybean');
  const [landArea, setLandArea] = useState<number | string>(user?.farm_size_acres || 10);
  const [startDate, setStartDate] = useState<string>('2026-06-15T07:00');
  const [endDate, setEndDate] = useState<string>('2026-06-17T18:00');
  const [durationHours, setDurationHours] = useState<number | string>(6);
  const [village, setVillage] = useState<string>(user?.village || 'Khed Shivapur, Pune');
  const [cropStage, setCropStage] = useState<string>('Peak ripening/Harvest-ready');
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>('Critical');
  const [urgencyReason, setUrgencyReason] = useState<string>(
    'Crop at peak harvest moisture. Immediate harvesting required ahead of forecasted weekend showers.'
  );
  const [additionalNotes, setAdditionalNotes] = useState<string>(
    'Combine operator required with machinery. Farm entrance road is 12ft wide gravel.'
  );

  // Validation & Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!resourceType) errs.resourceType = 'Resource type is required';
    if (!cropName.trim()) errs.cropName = 'Crop name is required';
    if (!landArea || Number(landArea) <= 0) errs.landArea = 'Please enter a valid land area in acres';
    if (!startDate) errs.startDate = 'Required start date/time is required';
    if (!endDate) errs.endDate = 'Required end date/time is required';

    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      if (end <= start) {
        errs.endDate = 'End date/time must be strictly after the start date/time';
      }
    }

    if (!durationHours || Number(durationHours) <= 0) {
      errs.durationHours = 'Required operating duration must be greater than 0 hours';
    }

    if (!village.trim()) errs.village = 'Farm village/location is required';
    if (!urgencyReason.trim()) errs.urgencyReason = 'Please explain the reason and deadline urgency';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Map category
      let category = 'Machinery';
      if (resourceType === 'Water Pump') category = 'Irrigation';
      else if (resourceType === 'Agricultural Labour') category = 'Labour';
      else if (resourceType === 'Storage') category = 'Storage';

      const newReq = requestService.createRequest({
        farmer_id: user?.id || 'farmer-101',
        farmer_name: user?.full_name || 'Ramesh Patel',
        category,
        resource_type: resourceType,
        crop_name: cropName.trim(),
        crop_stage: cropStage,
        land_area_acres: Number(landArea),
        earliest_start: startDate,
        latest_end: endDate,
        duration_hours: Number(durationHours),
        urgency_level: urgencyLevel,
        urgency_reason: urgencyReason.trim(),
        farm_location: village.trim(),
        additional_notes: additionalNotes.trim(),
      });

      // Add Notification
      notificationService.addNotification({
        user_id: user?.id || 'farmer-101',
        category: 'request_submitted',
        title: `Request Submitted: ${newReq.id} (${newReq.resource_type})`,
        message: `Your request for ${newReq.resource_type} on ${newReq.crop_name} (${newReq.land_area_acres} Acres) was recorded in Pending status.`,
        type: 'info',
        related_request_id: newReq.id,
        related_link: `/farmer/request/${newReq.id}`,
      });

      setIsSubmitting(false);
      setSubmittedRequestId(newReq.id);
    }, 400);
  };

  if (submittedRequestId) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <Card className="border-emerald-300 bg-emerald-50/40 shadow-sm">
          <CardHeader className="text-center pb-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-700" />
            </div>
            <CardTitle className="text-xl text-emerald-950 font-bold">
              Resource Request Submitted Successfully
            </CardTitle>
            <CardDescription className="text-xs text-emerald-900">
              Your request has entered the regional queue with reference ID: <strong>{submittedRequestId}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-white border border-emerald-200 text-sm space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-xs text-muted-foreground">Status:</span>
                <StatusBadge status="Pending" />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Resource Requested:</span>
                <span className="font-semibold text-foreground">{resourceType}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Crop & Parcel:</span>
                <span className="font-semibold text-foreground">{cropName} ({landArea} Acres)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Target Window:</span>
                <span className="font-semibold text-foreground">{startDate.replace('T', ' ')} — {endDate.replace('T', ' ')}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-farm-sage/50 border border-farm-sage-dark/30 text-xs text-farm-green-dark flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-farm-green" />
              <p>
                <strong>Allocation Transparency Rule:</strong> FarmGrid does not fabricate instant confirmed slots. The deterministic allocation engine will match compatible resources, score competing farmer requests, and prevent double-booking.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/farmer/my-requests')}
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                View in My Requests
              </Button>
              <Button
                className="flex-1 bg-farm-green hover:bg-farm-green-dark text-white font-semibold"
                onClick={() => navigate(`/farmer/request/${submittedRequestId}`)}
              >
                Inspect Request Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Submit Resource Request"
        description="Request agricultural equipment or services for your farm. All requests are evaluated fairly based on crop stage, weather risk, and deadline urgency."
      />

      <Card className="border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg">Agricultural Need & Field Details</CardTitle>
          <CardDescription className="text-xs">
            Complete all required fields accurately. These inputs determine your explainable priority score.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Resource Type Selection */}
            <div className="space-y-1.5">
              <Label htmlFor="resourceType">Resource Type *</Label>
              <Select
                id="resourceType"
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
              >
                {RESOURCE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
              {errors.resourceType && (
                <p className="text-xs text-destructive font-medium">{errors.resourceType}</p>
              )}
            </div>

            {/* 2. Crop Details: Name & Land Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="cropName">Crop Name *</Label>
                <Input
                  id="cropName"
                  placeholder="e.g. Soybean, Sugarcane, Wheat"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                />
                {errors.cropName && (
                  <p className="text-xs text-destructive font-medium">{errors.cropName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="landArea">Land Area (Acres) *</Label>
                <Input
                  id="landArea"
                  type="number"
                  min="0.5"
                  step="0.5"
                  placeholder="e.g. 10"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                />
                {errors.landArea && (
                  <p className="text-xs text-destructive font-medium">{errors.landArea}</p>
                )}
              </div>
            </div>

            {/* 3. Crop Biological Stage */}
            <div className="space-y-1.5">
              <Label htmlFor="cropStage">Crop Biological Stage *</Label>
              <Select
                id="cropStage"
                value={cropStage}
                onChange={(e) => setCropStage(e.target.value)}
              >
                {CROP_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Peak ripening/Harvest-ready carries highest biological vulnerability (20 pts).
              </p>
            </div>

            {/* 4. Time Window & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">Required Start Date & Time *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                {errors.startDate && (
                  <p className="text-xs text-destructive font-medium">{errors.startDate}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="endDate">Required End Date & Time *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                {errors.endDate && (
                  <p className="text-xs text-destructive font-medium">{errors.endDate}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="durationHours">Estimated Work Duration (Hours) *</Label>
                <Input
                  id="durationHours"
                  type="number"
                  min="1"
                  max="100"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                />
                {errors.durationHours && (
                  <p className="text-xs text-destructive font-medium">{errors.durationHours}</p>
                )}
              </div>
            </div>

            {/* 5. Village / Location */}
            <div className="space-y-1.5">
              <Label htmlFor="village">Farm Location (Village / Land Parcel) *</Label>
              <Input
                id="village"
                placeholder="e.g. Plot 14, Khed Shivapur, Pune"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
              />
              {errors.village && (
                <p className="text-xs text-destructive font-medium">{errors.village}</p>
              )}
            </div>

            {/* 6. Urgency Level */}
            <div className="space-y-2">
              <Label>Urgency Level *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {URGENCY_LEVELS.map((item) => (
                  <div
                    key={item.level}
                    onClick={() => setUrgencyLevel(item.level)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      urgencyLevel === item.level
                        ? 'border-farm-green bg-farm-sage/40 ring-1 ring-farm-green'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{item.label}</span>
                      {urgencyLevel === item.level && (
                        <CheckCircle2 className="w-4 h-4 text-farm-green" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Urgency Reason */}
            <div className="space-y-1.5">
              <Label htmlFor="urgencyReason">Urgency Reason & Deadline Details *</Label>
              <Textarea
                id="urgencyReason"
                rows={3}
                placeholder="Explain the specific risk (e.g. over-ripening, approaching storm front, canal water release)..."
                value={urgencyReason}
                onChange={(e) => setUrgencyReason(e.target.value)}
              />
              {errors.urgencyReason && (
                <p className="text-xs text-destructive font-medium">{errors.urgencyReason}</p>
              )}
            </div>

            {/* 8. Additional Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="additionalNotes">Additional Notes / Field Constraints (Optional)</Label>
              <Textarea
                id="additionalNotes"
                rows={2}
                placeholder="e.g. Access road width, fuel provided on site, specific attachments needed..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
              <p className="text-[11px] text-muted-foreground">
                Requests are stored securely and evaluated in accordance with FarmGrid rules.
              </p>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/farmer/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-farm-green hover:bg-farm-green-dark text-white font-semibold min-w-[140px]"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
