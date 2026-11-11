import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resourceService } from '@/services/resourceService';
import { Resource, ResourceStatus } from '@/types/resource';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  'Tractor',
  'Harvester',
  'Water Pump',
  'Agricultural Labour',
  'Storage',
] as const;

export const EditResourcePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [resource, setResource] = useState<Resource | undefined>(() =>
    id ? resourceService.getById(id) : undefined
  );

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Tractor');
  const [resourceType, setResourceType] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [fuel, setFuel] = useState('');
  const [operator, setOperator] = useState(true);
  const [attachments, setAttachments] = useState('');
  const [locationText, setLocationText] = useState('');
  const [rentalPrice, setRentalPrice] = useState<number | string>('');
  const [priceUnit, setPriceUnit] = useState<'hour' | 'day'>('hour');
  const [status, setStatus] = useState<ResourceStatus>('Available');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTo, setAvailableTo] = useState('');
  const [operatingStart, setOperatingStart] = useState('');
  const [operatingEnd, setOperatingEnd] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const res = resourceService.getById(id);
      if (res) {
        setResource(res);
        setName(res.name);
        setCategory(res.category);
        setResourceType(res.resource_type);
        setDescription(res.description);
        setCapacity(res.specs_json?.capacity || '');
        setFuel(res.specs_json?.fuel || '');
        setOperator(res.specs_json?.operator ?? true);
        setAttachments(res.specs_json?.attachments?.join(', ') || '');
        setLocationText(res.location_text);
        setRentalPrice(res.rental_price);
        setPriceUnit(res.price_unit);
        setStatus(res.status);
        setAvailableFrom(res.available_from || '');
        setAvailableTo(res.available_to || '');
        setOperatingStart(res.operating_start || '06:00');
        setOperatingEnd(res.operating_end || '18:00');
        setContactName(res.owner_contact_name || '');
        setContactPhone(res.owner_contact_phone || '');
      }
    }
  }, [id]);

  if (!resource) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-xl font-bold">Resource Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested resource ID does not exist.</p>
        <Button onClick={() => navigate('/owner/resources')}>Back to Fleet</Button>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !locationText.trim() || !rentalPrice) {
      setError('Please fill in all required fields.');
      return;
    }

    resourceService.updateResource(resource.id, {
      name: name.trim(),
      category,
      resource_type: resourceType.trim() || category,
      description: description.trim(),
      location_text: locationText.trim(),
      rental_price: Number(rentalPrice),
      price_unit: priceUnit,
      status,
      available_from: availableFrom,
      available_to: availableTo,
      operating_start: operatingStart,
      operating_end: operatingEnd,
      owner_contact_name: contactName.trim(),
      owner_contact_phone: contactPhone.trim(),
      specs_json: {
        capacity: capacity.trim(),
        fuel: fuel.trim(),
        operator,
        attachments: attachments.split(',').map((s) => s.trim()).filter(Boolean),
      },
    });

    setIsSaved(true);
    setTimeout(() => {
      navigate(`/owner/resource/${resource.id}`);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/owner/resources')}
          className="text-xs p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Resources
        </Button>
      </div>

      <PageHeader
        title={`Edit Resource: ${resource.name}`}
        description={`Modify specifications, availability status, or rental rate for equipment ID ${resource.id}.`}
      />

      {isSaved && (
        <div className="p-3.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            <strong>Changes Saved:</strong> Equipment updated in local fleet registry. Redirecting...
          </span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resource Details & Status</CardTitle>
          <CardDescription className="text-xs">
            Changes will take effect immediately for upcoming allocation evaluations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Resource Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category">Category *</Label>
                <Select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="resourceType">Model / Sub-type</Label>
              <Input
                id="resourceType"
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="capacity">Capacity Specification</Label>
                <Input
                  id="capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fuel">Fuel Type</Label>
                <Input
                  id="fuel"
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="attachments">Attachments (Comma-separated)</Label>
                <Input
                  id="attachments"
                  value={attachments}
                  onChange={(e) => setAttachments(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="operator">Operator Provision</Label>
                <Select
                  id="operator"
                  value={operator ? 'yes' : 'no'}
                  onChange={(e) => setOperator(e.target.value === 'yes')}
                >
                  <option value="yes">Yes — Dedicated operator provided</option>
                  <option value="no">No — Self-operated</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="price">Rental Rate (₹) *</Label>
                <div className="flex gap-2">
                  <Input
                    id="price"
                    type="number"
                    value={rentalPrice}
                    onChange={(e) => setRentalPrice(e.target.value)}
                    required
                  />
                  <Select
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value as 'hour' | 'day')}
                    className="w-36"
                  >
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">Current Status *</Label>
                <Select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ResourceStatus)}
                >
                  <option value="Available">Available</option>
                  <option value="Currently Booked">Currently Booked</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Broken Down">Broken Down</option>
                  <option value="Unavailable">Unavailable</option>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Depot Location *</Label>
              <Input
                id="location"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="from">Available From</Label>
                <Input
                  id="from"
                  type="date"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="to">Available To</Label>
                <Input
                  id="to"
                  type="date"
                  value={availableTo}
                  onChange={(e) => setAvailableTo(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/owner/resources')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-farm-green hover:bg-farm-green-dark text-white font-semibold"
              >
                <Save className="w-4 h-4 mr-2" />
                Update Resource
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
