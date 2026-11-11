import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLogo } from '@/components/common/AppLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ROLES, UserRole } from '@/lib/constants';
import { User, Tractor, ShieldAlert } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'farmer' | 'owner'>('farmer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [village, setVillage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-farm-sand flex flex-col justify-center items-center p-4">
      <div className="mb-6">
        <AppLogo showTagline={true} />
      </div>

      <Card className="w-full max-w-lg shadow-md border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create FarmGrid Account</CardTitle>
          <CardDescription>
            Join the agricultural resource coordination platform
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection: Farmer or Resource Owner only */}
            <div className="space-y-1.5">
              <Label>Select Account Type</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    role === 'farmer'
                      ? 'border-farm-green bg-farm-sage/30 text-farm-green-dark ring-2 ring-farm-green'
                      : 'border-border hover:bg-muted text-foreground'
                  }`}
                >
                  <User className="w-5 h-5 text-farm-green shrink-0" />
                  <div>
                    <p className="text-xs font-bold">Farmer</p>
                    <p className="text-[11px] text-muted-foreground">Request equipment</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    role === 'owner'
                      ? 'border-farm-green bg-farm-sage/30 text-farm-green-dark ring-2 ring-farm-green'
                      : 'border-border hover:bg-muted text-foreground'
                  }`}
                >
                  <Tractor className="w-5 h-5 text-farm-green shrink-0" />
                  <div>
                    <p className="text-xs font-bold">Resource Owner</p>
                    <p className="text-[11px] text-muted-foreground">List & share machinery</p>
                  </div>
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Administrative accounts are provisioned securely by system policy.</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                placeholder="e.g. Ramesh Patel"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="village">Village / Tehsil Location</Label>
              <Input
                id="village"
                placeholder="e.g. Shirwal, Satara District"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Create Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-farm-green hover:bg-farm-green-dark text-white font-semibold mt-4"
            >
              Complete Registration
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center text-xs text-muted-foreground border-t border-border pt-4">
          <p>
            Already registered?{' '}
            <Link to="/login" className="text-farm-green font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
