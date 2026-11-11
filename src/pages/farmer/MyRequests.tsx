import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { requestService } from '@/services/requestService';
import { ResourceRequest, RequestStatus } from '@/types/request';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
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
  PlusCircle,
  Search,
  Filter,
  Eye,
  XCircle,
  CalendarCheck,
  Tractor,
  Calendar,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const MyRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const farmerId = user?.id || 'farmer-101';

  const [requests, setRequests] = useState<ResourceRequest[]>(() =>
    requestService.getByFarmer(farmerId)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Cancel dialog state
  const [requestToCancel, setRequestToCancel] = useState<ResourceRequest | null>(null);

  const loadRequests = () => {
    setRequests(requestService.getByFarmer(farmerId));
  };

  useEffect(() => {
    loadRequests();
    const handleUpdate = () => loadRequests();
    window.addEventListener('farmgrid_requests_updated', handleUpdate);
    return () => window.removeEventListener('farmgrid_requests_updated', handleUpdate);
  }, [farmerId]);

  const handleConfirmCancel = () => {
    if (!requestToCancel) return;
    requestService.cancelRequest(requestToCancel.id, 'Cancelled by farmer via My Requests portal.');
    setRequestToCancel(null);
  };

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.farm_location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesType = typeFilter === 'All' || req.resource_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const formatWindow = (start: string, end: string) => {
    try {
      const s = new Date(start);
      const e = new Date(end);
      return `${s.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} — ${e.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
    } catch {
      return `${start} — ${end}`;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Resource Requests"
        description="Search, filter, and monitor the scheduling lifecycle of all your agricultural equipment requests."
        action={
          <Button
            onClick={() => navigate('/farmer/new-request')}
            className="bg-farm-green hover:bg-farm-green-dark text-white font-semibold"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Request
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, equipment, or crop..."
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
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Waiting">Waiting</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Select>
          </div>

          <div>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Resource Types</option>
              <option value="Harvester">Harvester</option>
              <option value="Tractor">Tractor</option>
              <option value="Water Pump">Water Pump</option>
              <option value="Agricultural Labour">Agricultural Labour</option>
              <option value="Storage">Storage</option>
            </Select>
          </div>
        </div>

        {/* Active Filter Pills */}
        {(statusFilter !== 'All' || typeFilter !== 'All' || searchTerm) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
            <span>Active filters:</span>
            {statusFilter !== 'All' && (
              <span className="px-2 py-0.5 rounded bg-muted font-medium text-foreground">
                Status: {statusFilter}
              </span>
            )}
            {typeFilter !== 'All' && (
              <span className="px-2 py-0.5 rounded bg-muted font-medium text-foreground">
                Type: {typeFilter}
              </span>
            )}
            {searchTerm && (
              <span className="px-2 py-0.5 rounded bg-muted font-medium text-foreground">
                Query: "{searchTerm}"
              </span>
            )}
            <button
              onClick={() => {
                setStatusFilter('All');
                setTypeFilter('All');
                setSearchTerm('');
              }}
              className="text-farm-green hover:underline ml-auto flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          </div>
        )}
      </Card>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          {filteredRequests.length === 0 ? (
            <EmptyState
              title="No matching requests found"
              description={
                requests.length === 0
                  ? 'You have not submitted any equipment requests yet.'
                  : 'Try adjusting your search terms or filters.'
              }
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
                  <TableHead>Crop Name</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Required Window</TableHead>
                  <TableHead>Priority Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs font-semibold text-foreground">
                      {req.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {req.resource_type}
                      <span className="block text-[11px] text-muted-foreground">
                        {req.duration_hours} hrs requested
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">
                      <span className="font-semibold text-foreground">{req.crop_name}</span>
                      <span className="block text-muted-foreground">
                        {req.land_area_acres} Acres • {req.crop_stage}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(req.submitted_at)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatWindow(req.earliest_start, req.latest_end)}
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
                    <TableCell>
                      <StatusBadge status={req.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/farmer/request/${req.id}`)}
                          className="text-xs text-farm-green hover:text-farm-green-dark"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Details
                        </Button>

                        {/* If request is Scheduled, link to Allocation Results */}
                        {req.status === 'Scheduled' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/farmer/allocations')}
                            className="text-xs text-emerald-800 border-emerald-300 bg-emerald-50 hover:bg-emerald-100"
                          >
                            <CalendarCheck className="w-3.5 h-3.5 mr-1" />
                            Slot
                          </Button>
                        )}

                        {/* Allow cancellation if Pending, Scheduled, or Waiting */}
                        {['Pending', 'Scheduled', 'Waiting'].includes(req.status) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRequestToCancel(req)}
                            className="text-xs text-destructive hover:bg-destructive/10"
                            title="Cancel request"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Cancellation Confirmation Dialog */}
      <ConfirmDialog
        open={!!requestToCancel}
        onOpenChange={(open) => !open && setRequestToCancel(null)}
        title="Cancel Resource Request"
        description={`Are you sure you want to cancel request ${requestToCancel?.id} for ${requestToCancel?.resource_type}? If already scheduled, releasing this slot will free the equipment for the next waiting farmer.`}
        confirmLabel="Yes, Cancel Request"
        variant="destructive"
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
};
