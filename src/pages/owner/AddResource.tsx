import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { resourceService } from '@/services/resourceService';
import { notificationService } from '@/services/notificationService';
import { ResourceStatus } from '@/types/resource';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  PlusCircle,
  Tractor,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

const CATEGORIES = [
  'Tractor',
  'Harvester',
  'Water Pump',
  'Agricultural Labour',
  'Storage',
] as const;

export const AddResourcePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const ownerId = user?.id || 'owner-201';

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Tractor');
  const [resourceType, setResourceType] = useState('50 HP Multi-utility Tractor');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('50 HP, 1,800 kg lift capacity');
  const [fuel, setFuel] = useState('Diesel');
  const [operator, setOperator] = useState(true);
  const [attachments, setAttachments] = useState('Rotary Tiller, Harrow');
  const [locationText, setLocationText] = useState(user?.village || 'Shirwal Agro Hub, Gate 2, Satara');
  const [rentalPrice, setRentalPrice] = useState<number | string>(1100);
  const [priceUnit, setPriceUnit] = useState<'hour' | 'day'>('hour');
  const [status, setStatus] = useState<ResourceStatus>('Available');
  const [availableFrom, setAvailableFrom] = useState('2026-06-15');
  const [availableTo, setAvailableTo] = useState('2026-07-31');
  const [operatingStart, setOperatingStart] = useState('06:00');
  const [operatingEnd, setOperatingEnd] = useState('18:00');
  const [contactName, setContactName] = useState(user?.full_name || 'Suresh Shinde');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+91 98230 11223');

  // Validation & Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdResourceId, setCreatedResourceId] = useState<string | null>(null);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Resource name is required';
    if (!category) errs.category = 'Category is required';
    if (!locationText.trim()) errs.locationText = 'Depot location is required';
    if (!rentalPrice || Number(rentalPrice) <= 0) errs.rentalPrice = 'Valid rental price is required';
    if (!availableFrom) errs.availableFrom = 'Available start date is required';
    if (!availableTo) errs.availableTo = 'Available end date is required';
    if (availableFrom && availableTo && new Date(availableTo) < new Date(availableFrom)) {
      errs.availableTo = 'End date must be on or after start date';
    }
    if (!contactPhone.trim()) errs.contactPhone = 'Contact phone is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newRes = resourceService.createResource({
        owner_id: ownerId,
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

      // Notification
      notificationService.addNotification({
        user_id: ownerId,
        category: 'resource_allocated',
        title: `Resource Registered: ${newRes.name}`,
        message: `${newRes.name} (${newRes.category}) is now listed in ${newRes.status} status. Ready for scheduling.`,
        type: 'success',
        related_link: `/owner/resource/${newRes.id}`,
      });

      setIsSubmitting(false);
      setCreatedResourceId(newRes.id);
    }, 400);
  };

  if (createdResourceId) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <Card className="border-emerald-300 bg-emerald-50/40 shadow-sm">
          <CardHeader className="text-center pb-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-700" />
            </div>
            <CardTitle className="text-xl text-emerald-950 font-bold">
              Equipment Registered Successfully
            </CardTitle>
            <CardDescription className="text-xs text-emerald-900">
              New physical resource ID: <strong>{createdResourceId}</strong> is saved to your fleet registry.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-white border border-emerald-200 text-sm space-y-2">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-border">
                <span className="text-muted-foreground">Resource Name:</span>
                <span className="font-semibold text-foreground">{name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-semibold text-foreground">{category}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Rental Rate:</span>
                <span className="font-semibold text-emerald-800">₹{Number(rentalPrice).toLocaleString()} / {priceUnit}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Initial Status:</span>
                <span className="font-semibold text-foreground">{status}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Depot Location:</span>
                <span className="font-semibold text-foreground">{locationText}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/owner/resources')}
              >
                View in Fleet Registry
              </Button>
              <Button
                className="flex-1 bg-farm-green hover:bg-farm-green-dark text-white font-semibold"
                onClick={() => navigate(`/owner/resource/${createdResourceId}`)}
              >
                Inspect Resource Details
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
        title="Add Equipment Resource"
        description="Register a new physical agricultural machine, irrigation unit, or labor team to receive automated, conflict-free bookings."
      />

      <Card className="border-border shadow-xs">
        <CardHeader>
          <CardTitle className="text-lg">Resource Specifications & Rental Parameters</CardTitle>
          <CardDescription className="text-xs">
            Enter accurate machine capabilities and base location. The allocation engine uses these to compute proximity and feasibility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Resource / Machine Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. John Deere 5050D Tractor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category">Equipment Category *</Label>
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
                {errors.category && <p className="text-xs text-destructive font-medium">{errors.category}</p>}
              </div>
            </div>

            {/* 2. Specific Model / Type & Description */}
            <div className="space-y-1.5">
              <Label htmlFor="resourceType">Specific Sub-type / Model Name</Label>
              <Input
                id="resourceType"
                placeholder="e.g. 50HP Utility Tractor, Paddy Combine Harvester"
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="desc">Full Description & Condition</Label>
              <Textarea
                id="desc"
                rows={2}
                placeholder="Describe machine condition, maintenance status, suitable soil types, and operational highlights..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* 3. Specifications & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="capacity">Capacity / Output Specification</Label>
                <Input
                  id="capacity"
                  placeholder="e.g. 50 HP / 1.5 Tons/hr / 1,200 L/min"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fuel">Fuel Type & Coverage</Label>
                <Input
                  id="fuel"
                  placeholder="e.g. Diesel (Included in rental)"
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="attachments">Included Attachments / Tools (Comma separated)</Label>
                <Input
                  id="attachments"
                  placeholder="e.g. Rotary Tiller, Tipping Trailer, Ploughs"
                  value={attachments}
                  onChange={(e) => setAttachments(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="operator">Trained Operator Included?</Label>
                <Select
                  id="operator"
                  value={operator ? 'yes' : 'no'}
                  onChange={(e) => setOperator(e.target.value === 'yes')}
                >
                  <option value="yes">Yes — Dedicated operator provided</option>
                  <option value="no">No — Self-operated by farmer</option>
                </Select>
              </div>
            </div>

            {/* 4. Pricing & Depot Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="price">Rental Rate (₹) *</Label>
                <div className="flex gap-2">
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    placeholder="e.g. 1100"
                    value={rentalPrice}
                    onChange={(e) => setRentalPrice(e.target.value)}
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
                {errors.rentalPrice && <p className="text-xs text-destructive font-medium">{errors.rentalPrice}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">Initial Availability Status *</Label>
                <Select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ResourceStatus)}
                >
                  <option value="Available">Available</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                  <option value="Broken Down">Broken Down</option>
                  <option value="Unavailable">Unavailable</option>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Depot / Base Storage Location *</Label>
              <Input
                id="location"
                placeholder="e.g. Shirwal Agro Hub, Gate 2, Satara District"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
              />
              {errors.locationText && <p className="text-xs text-destructive font-medium">{errors.locationText}</p>}
            </div>

            {/* 5. Available Dates & Operating Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="availableFrom">Available From Date *</Label>
                <Input
                  id="availableFrom"
                  type="date"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                />
                {errors.availableFrom && <p className="text-xs text-destructive font-medium">{errors.availableFrom}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="availableTo">Available Until Date *</Label>
                <Input
                  id="availableTo"
                  type="date"
                  value={availableTo}
                  onChange={(e) => setAvailableTo(e.target.value)}
                />
                {errors.availableTo && <p className="text-xs text-destructive font-medium">{errors.availableTo}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="opStart">Daily Operating Window (Start Time)</Label>
                <Input
                  id="opStart"
                  type="time"
                  value={operatingStart}
                  onChange={(e) => setOperatingStart(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="opEnd">Daily Operating Window (End Time)</Label>
                <Input
                  id="opEnd"
                  type="time"
                  value={operatingEnd}
                  onChange={(e) => setOperatingEnd(e.target.value)}
                />
              </div>
            </div>

            {/* 6. Owner Contact Information */}
            <div className="pt-2 border-t border-border">
              <h4 className="text-sm font-bold text-foreground mb-3">Owner Contact Coordinates</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contactName">Contact Person Name</Label>
                  <Input
                    id="contactName"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contactPhone">Contact Phone Number *</Label>
                  <Input
                    id="contactPhone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                  {errors.contactPhone && <p className="text-xs text-destructive font-medium">{errors.contactPhone}</p>}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Owner phone is kept confidential and only shared with the confirmed farmer when their booking starts.
              </p>
            </div>

            {/* Form Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
              <span className="text-xs text-muted-foreground">
                All resources are registered with unique hardware UUIDs.
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/owner/resources')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-farm-green hover:bg-farm-green-dark text-white font-semibold min-w-[140px]"
                >
                  {isSubmitting ? (
                    'Saving Resource...'
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Register Resource
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
