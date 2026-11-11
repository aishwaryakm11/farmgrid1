import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { resourceService } from '@/services/resourceService';
import { Resource } from '@/types/resource';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import {
  PlusCircle,
  Tractor,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  RotateCcw,
  CheckCircle2,
  Wrench,
} from 'lucide-react';

export const MyResourcesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const ownerId = user?.id || 'owner-201';

  const [resources, setResources] = useState<Resource[]>(() =>
    resourceService.getAll(ownerId)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Delete dialog state
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);

  const loadResources = () => {
    setResources(resourceService.getAll(ownerId));
  };

  useEffect(() => {
    loadResources();
    const handleUpdate = () => loadResources();
    window.addEventListener('farmgrid_resources_updated', handleUpdate);
    return () => window.removeEventListener('farmgrid_resources_updated', handleUpdate);
  }, [ownerId]);

  const handleDeleteConfirm = () => {
    if (!resourceToDelete) return;
    resourceService.deleteResource(resourceToDelete.id);
    setResourceToDelete(null);
  };

  // Filter resources
  const filtered = resources.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.location_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' || res.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'All' || res.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Registered Resources"
        description="Review, edit, and configure availability for all equipment units registered under your ownership."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/owner/availability')}
            >
              Availability Grid
            </Button>
            <Button
              onClick={() => navigate('/owner/add-resource')}
              className="bg-farm-green hover:bg-farm-green-dark text-white font-semibold"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </div>
        }
      />

      {/* Search and Filters Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or depot location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Tractor">Tractor</option>
              <option value="Harvester">Harvester</option>
              <option value="Water Pump">Water Pump</option>
              <option value="Agricultural Labour">Agricultural Labour</option>
              <option value="Storage">Storage</option>
            </Select>
          </div>

          <div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Currently Booked">Currently Booked</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Broken Down">Broken Down</option>
              <option value="Unavailable">Unavailable</option>
            </Select>
          </div>
        </div>

        {/* Active filter summary */}
        {(categoryFilter !== 'All' || statusFilter !== 'All' || searchTerm) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
            <span>Filters:</span>
            {categoryFilter !== 'All' && (
              <span className="px-2 py-0.5 rounded bg-muted font-medium text-foreground">
                Category: {categoryFilter}
              </span>
            )}
            {statusFilter !== 'All' && (
              <span className="px-2 py-0.5 rounded bg-muted font-medium text-foreground">
                Status: {statusFilter}
              </span>
            )}
            {searchTerm && (
              <span className="px-2 py-0.5 rounded bg-muted font-medium text-foreground">
                Query: "{searchTerm}"
              </span>
            )}
            <button
              onClick={() => {
                setCategoryFilter('All');
                setStatusFilter('All');
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

      {/* Resources Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No resources found"
          description={
            resources.length === 0
              ? 'You have not registered any agricultural equipment or service teams yet.'
              : 'No equipment matches the chosen filter parameters.'
          }
          icon={Tractor}
          actionLabel="Register First Resource"
          onAction={() => navigate('/owner/add-resource')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col justify-between hover:border-farm-green/50 transition-all shadow-xs"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-lg bg-farm-sage text-farm-green">
                    <Tractor className="w-5 h-5" />
                  </div>
                  <StatusBadge status={item.status} />
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-muted-foreground uppercase">
                    <span>{item.id}</span>
                    <span className="text-farm-green-dark font-sans font-bold bg-farm-sage/50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground mt-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {item.description || item.resource_type}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/70 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rental Rate:</span>
                    <span className="font-bold text-foreground text-sm">
                      ₹{item.rental_price.toLocaleString()} / {item.price_unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-farm-green shrink-0" />
                    <span className="truncate">{item.location_text}</span>
                  </div>

                  {item.operating_start && item.operating_end && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-farm-green shrink-0" />
                      <span>Hours: {item.operating_start} — {item.operating_end}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="px-4 py-3 bg-muted/30 border-t border-border flex items-center justify-between gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/owner/resource/${item.id}`)}
                  className="text-xs text-farm-green hover:text-farm-green-dark h-8 px-2"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  Details
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/owner/edit-resource/${item.id}`)}
                    className="text-xs h-8 px-2.5"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setResourceToDelete(item)}
                    className="text-xs text-destructive hover:bg-destructive/10 h-8 px-2"
                    title="Delete resource"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!resourceToDelete}
        onOpenChange={(open) => !open && setResourceToDelete(null)}
        title="Delete Equipment Resource"
        description={`Are you sure you want to delete ${resourceToDelete?.name} (${resourceToDelete?.id})? This will permanently remove the equipment from regional allocation matching.`}
        confirmLabel="Yes, Delete Resource"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
