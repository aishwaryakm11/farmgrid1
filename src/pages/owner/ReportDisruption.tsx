import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { resourceService } from '@/services/resourceService';
import { disruptionService } from '@/services/disruptionService';
import { Resource } from '@/types/resource';
import { DisruptionRecord, DisruptionType } from '@/types/allocation';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { AlertOctagon, CheckCircle2, AlertTriangle, Clock, Wrench } from 'lucide-react';

export const ReportDisruptionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const ownerId = user?.id || 'owner-201';

  const [resources, setResources] = useState<Resource[]>(() =>
    resourceService.getAll(ownerId)
  );
  const [disruptions, setDisruptions] = useState<DisruptionRecord[]>(() =>
    disruptionService.getByOwner(ownerId)
  );

  // Form State
  const [selectedResourceId, setSelectedResourceId] = useState<string>(
    resources[0]?.id || 'RES-01'
  );
  const [disruptionType, setDisruptionType] = useState<DisruptionType>('Breakdown');
  const [description, setDescription] = useState('');
  const [startsAt, setStartsAt] = useState('2026-06-14T06:00');
  const [endsAt, setEndsAt] = useState('2026-06-15T18:00');
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReport, setSuccessReport] = useState<DisruptionRecord | null>(null);
  const [error, setError] = useState('');

  const loadData = () => {
    setResources(resourceService.getAll(ownerId));
    setDisruptions(disruptionService.getByOwner(ownerId));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('farmgrid_resources_updated', loadData);
    window.addEventListener('farmgrid_disruptions_updated', loadData);
    return () => {
      window.removeEventListener('farmgrid_resources_updated', loadData);
      window.removeEventListener('farmgrid_disruptions_updated', loadData);
    };
  }, [ownerId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a description of the mechanical issue or disruption.');
      return;
    }

    if (new Date(endsAt) <= new Date(startsAt)) {
      setError('Expected resolution must be after the disruption start timestamp.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const resource = resources.find((r) => r.id === selectedResourceId);
    const resourceName = resource ? resource.name : 'Equipment';

    setTimeout(() => {
      const record = disruptionService.createDisruption({
        resource_id: selectedResourceId,
        resource_name: resourceName,
        owner_id: ownerId,
        disruption_type: disruptionType,
        description: description.trim(),
        starts_at: startsAt,
        ends_at: endsAt,
        severity,
      });

      setIsSubmitting(false);
      setSuccessReport(record);
      setDescription('');
      loadData();
    }, 400);
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Report Resource Disruption"
        description="Notify FarmGrid of equipment breakdown, maintenance downtime, or unexpected transit delays. System initiates immediate reallocation checks for affected bookings."
      />

      {/* Success Notification Banner */}
      {successReport && (
        <Card className="border-amber-300 bg-amber-50/70 animate-in fade-in">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-950 font-bold">
                <AlertOctagon className="w-5 h-5 text-amber-700" />
                <CardTitle className="text-base">
                  Disruption Event Logged: {successReport.id}
                </CardTitle>
              </div>
              <StatusBadge status="Under Maintenance" />
            </div>
            <CardDescription className="text-xs text-amber-900">
              <strong>{successReport.resource_name}</strong> status updated to{' '}
              <strong>
                {successReport.disruption_type === 'Breakdown' ? 'Broken Down' : 'Under Maintenance'}
              </strong>
              . Candidate slot matching has been suspended for the reported window.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSuccessReport(null)}
              className="text-xs bg-white text-amber-950 border-amber-300"
            >
              Dismiss Notice
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="p-3.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Disruption Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">New Disruption Incident Form</CardTitle>
          <CardDescription className="text-xs">
            Submit immediate reports to protect farmer schedules and avoid double-booking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="resourceSelect">Select Affected Resource *</Label>
                <Select
                  id="resourceSelect"
                  value={selectedResourceId}
                  onChange={(e) => setSelectedResourceId(e.target.value)}
                >
                  {resources.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.id} — {res.name} ({res.category})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="disruptionType">Disruption Type *</Label>
                <Select
                  id="disruptionType"
                  value={disruptionType}
                  onChange={(e) => setDisruptionType(e.target.value as DisruptionType)}
                >
                  <option value="Breakdown">Mechanical Breakdown / Failure</option>
                  <option value="Maintenance">Emergency / Scheduled Maintenance</option>
                  <option value="Unavailable">Temporary Unavailability</option>
                  <option value="Delay">Field Transit Delay</option>
                  <option value="Weather Alert">Severe Field Weather Inaccessibility</option>
                  <option value="Other">Other Operational Constraint</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="severity">Impact Severity</Label>
                <Select
                  id="severity"
                  value={severity}
                  onChange={(e) =>
                    setSeverity(e.target.value as 'Low' | 'Medium' | 'High' | 'Critical')
                  }
                >
                  <option value="Critical">Critical (Halts field operations)</option>
                  <option value="High">High (Immediate delay)</option>
                  <option value="Medium">Medium (Pre-scheduled service)</option>
                  <option value="Low">Low (Minor delay, recoverable)</option>
                </Select>
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="startsAt">Downtime Starts *</Label>
                <Input
                  id="startsAt"
                  type="datetime-local"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="endsAt">Expected Resolution *</Label>
                <Input
                  id="endsAt"
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="desc">Diagnosis & Description of Issue *</Label>
              <Textarea
                id="desc"
                rows={3}
                placeholder="Explain the mechanical defect, required spare parts, or delay cause (e.g. hydraulic hose rupture, bearing replacement, field mud blockage)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/owner/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-amber-700 hover:bg-amber-800 text-white font-semibold"
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    <AlertOctagon className="w-4 h-4 mr-2" />
                    Log Disruption & Update Status
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Previously Submitted Disruption Reports */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Logged Disruption Reports ({disruptions.length})</CardTitle>
          <CardDescription className="text-xs">
            Historical audit log of downtime reports and resulting system reallocations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Downtime Window</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disruptions.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs font-semibold">{d.id}</TableCell>
                  <TableCell className="font-semibold text-xs text-foreground">
                    {d.resource_name}
                  </TableCell>
                  <TableCell className="text-xs">{d.disruption_type}</TableCell>
                  <TableCell className="text-xs max-w-xs truncate text-muted-foreground">
                    {d.description}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(d.starts_at)} — {formatDate(d.ends_at)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        d.severity === 'Critical' || d.severity === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {d.severity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={d.status === 'Active' ? 'Under Maintenance' : 'Resolved'} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
