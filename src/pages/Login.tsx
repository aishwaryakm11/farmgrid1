import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLogo } from '@/components/common/AppLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ROLES, UserRole } from '@/lib/constants';
import { Shield, Tractor, User, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>(ROLES.FARMER);
  const [email, setEmail] = useState('farmer@farmgrid.org');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === ROLES.FARMER) setEmail('farmer@farmgrid.org');
    else if (role === ROLES.OWNER) setEmail('owner@farmgrid.org');
    else setEmail('admin@farmgrid.org');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(selectedRole);
      setIsLoading(false);
      navigate(`/${selectedRole}/dashboard`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-farm-sand flex flex-col justify-center items-center p-4">
      <div className="mb-6">
        <AppLogo showTagline={true} />
      </div>

      <Card className="w-full max-w-md shadow-md border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign In to FarmGrid</CardTitle>
          <CardDescription>
            Select your account role to access your portal
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Role selector tabs */}
          <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => handleRoleSelect(ROLES.FARMER)}
              className={`flex flex-col items-center py-2 px-1 rounded-md text-xs font-semibold transition-all ${
                selectedRole === ROLES.FARMER
                  ? 'bg-farm-green text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="w-4 h-4 mb-1" />
              <span>Farmer</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect(ROLES.OWNER)}
              className={`flex flex-col items-center py-2 px-1 rounded-md text-xs font-semibold transition-all ${
                selectedRole === ROLES.OWNER
                  ? 'bg-farm-green text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Tractor className="w-4 h-4 mb-1" />
              <span>Owner</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect(ROLES.ADMIN)}
              className={`flex flex-col items-center py-2 px-1 rounded-md text-xs font-semibold transition-all ${
                selectedRole === ROLES.ADMIN
                  ? 'bg-farm-green text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shield className="w-4 h-4 mb-1" />
              <span>Admin</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-xs text-farm-green hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-farm-green hover:bg-farm-green-dark text-white font-semibold mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : `Sign In as ${selectedRole.toUpperCase()}`}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 text-center text-xs text-muted-foreground border-t border-border pt-4">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-farm-green font-semibold hover:underline">
              Create an account
            </Link>
          </p>
          <Link to="/" className="text-muted-foreground hover:text-foreground mt-1">
            ← Back to Homepage
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
