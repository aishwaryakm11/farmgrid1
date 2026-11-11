import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, User, MapPin, Phone, Mail, Wheat, ShieldCheck } from 'lucide-react';

export const FarmerProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || 'Ramesh Patel');
  const [email, setEmail] = useState(user?.email || 'ramesh.farmer@farmgrid.org');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [village, setVillage] = useState(user?.village || 'Khed Shivapur');
  const [district, setDistrict] = useState(user?.district || 'Pune');
  const [farmSize, setFarmSize] = useState<number | string>(user?.farm_size_acres || 12);
  const [crops, setCrops] = useState(user?.crop_name || 'Soybean & Sugarcane');

  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !village.trim()) {
      setErrorMessage('Please fill in all required profile fields.');
      return;
    }

    setErrorMessage('');
    updateProfile({
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      village: village.trim(),
      district: district.trim(),
      farm_size_acres: Number(farmSize),
      crop_name: crops.trim(),
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Farmer Profile & Land Records"
        description="Manage your contact details, village base depot, farm acreage, and seasonal crops."
      />

      {isSaved && (
        <div className="p-3.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            <strong>Profile Updated Successfully:</strong> Your farm location and crop information have been saved and persisted.
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSave}>
        <Card className="border-border shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Personal & Contact Coordinates</CardTitle>
                <CardDescription className="text-xs">
                  Used by dispatchers to coordinate machine delivery buffers
                </CardDescription>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-farm-sage text-farm-green-dark flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-farm-green" />
                Verified Farmer Account
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullname">Full Name *</Label>
                <Input
                  id="fullname"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="role">Platform Role (Read-Only)</Label>
                <Input
                  id="role"
                  value={user?.role?.toUpperCase() || 'FARMER'}
                  disabled
                  className="bg-muted font-bold text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Contact Phone Number *</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <h4 className="text-sm font-bold text-foreground mb-3">Farm Land Parcel Details</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="village">Village / Settlement *</Label>
                  <Input
                    id="village"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="district">District / Tehsil *</Label>
                  <Input
                    id="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="farmSize">Total Cultivated Area (Acres) *</Label>
                  <Input
                    id="farmSize"
                    type="number"
                    min="1"
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 mt-4">
                <Label htmlFor="crops">Primary Crops Cultivated *</Label>
                <Input
                  id="crops"
                  value={crops}
                  onChange={(e) => setCrops(e.target.value)}
                  placeholder="e.g. Soybean, Sugarcane, Wheat, Cotton"
                  required
                />
                <p className="text-[11px] text-muted-foreground">
                  Default crop parameters will prepopulate future equipment requests.
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">
              Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'May 2026'}
            </span>
            <Button
              type="submit"
              className="bg-farm-green hover:bg-farm-green-dark text-white font-semibold"
            >
              Save Profile Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
