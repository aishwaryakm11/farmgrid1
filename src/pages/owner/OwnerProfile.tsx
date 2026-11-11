import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, ShieldCheck, Tractor, MapPin } from 'lucide-react';

export const OwnerProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || 'Suresh Shinde');
  const [email, setEmail] = useState(user?.email || 'suresh.owner@farmgrid.org');
  const [phone, setPhone] = useState(user?.phone || '+91 98230 11223');
  const [village, setVillage] = useState(user?.village || 'Shirwal Agro Hub');
  const [district, setDistrict] = useState(user?.district || 'Satara');

  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !village.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    updateProfile({
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      village: village.trim(),
      district: district.trim(),
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Resource Owner Profile"
        description="Depot contact details, hub location, and business coordinates for regional equipment dispatch."
      />

      {isSaved && (
        <div className="p-3.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 text-sm flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            <strong>Owner Profile Updated:</strong> Depot location and contact details saved successfully.
          </span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-lg border border-destructive/20 bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSave}>
        <Card className="border-border shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Owner & Fleet Hub Credentials</CardTitle>
                <CardDescription className="text-xs">
                  Coordinates used for travel and logistics scoring
                </CardDescription>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-farm-sage text-farm-green-dark flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-farm-green" />
                Verified Resource Owner
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullname">Full Name / Business Entity *</Label>
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
                  value={user?.role?.toUpperCase() || 'OWNER'}
                  disabled
                  className="bg-muted font-bold text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Dispatch Phone Number *</Label>
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
              <h4 className="text-sm font-bold text-foreground mb-3">Base Machinery Hub & Depot</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="village">Central Fleet Hub / Village *</Label>
                  <Input
                    id="village"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mt-3 p-3 rounded-lg bg-farm-sand border border-border text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Proximity Factor Calculation: </span>
                Your central hub coordinates are referenced by the allocation engine to calculate estimated road transit buffers (10 pts factor) for nearby farmers.
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-border pt-4">
            <span className="text-xs text-muted-foreground">
              Fleet Registered: 5 Physical Units
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
