import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
import { UserRole, ROLES } from '@/lib/constants';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const DEFAULT_USERS: Record<UserRole, UserProfile> = {
  [ROLES.FARMER]: {
    id: 'farmer-101',
    full_name: 'Ramesh Patel (Farmer A)',
    email: 'ramesh.farmer@farmgrid.org',
    phone: '+91 98765 43210',
    role: ROLES.FARMER,
    village: 'Khed Shivapur',
    district: 'Pune',
    farm_size_acres: 12,
    crop_name: 'Soybean & Sugarcane',
    status: 'Active',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  [ROLES.OWNER]: {
    id: 'owner-201',
    full_name: 'Suresh Shinde (Resource Owner)',
    email: 'suresh.owner@farmgrid.org',
    phone: '+91 98230 11223',
    role: ROLES.OWNER,
    village: 'Shirwal Agro Hub',
    district: 'Satara',
    status: 'Active',
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  [ROLES.ADMIN]: {
    id: 'admin-001',
    full_name: 'Vikramjit Deshmukh (Admin)',
    email: 'admin@farmgrid.org',
    phone: '+91 94220 99887',
    role: ROLES.ADMIN,
    status: 'Active',
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = 'farmgrid_active_role';
const getProfileStorageKey = (role: UserRole) => `farmgrid_profile_${role}`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
    return saved && Object.values(ROLES).includes(saved) ? saved : ROLES.FARMER;
  });

  const loadProfile = (currentRole: UserRole): UserProfile => {
    const saved = localStorage.getItem(getProfileStorageKey(currentRole));
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return DEFAULT_USERS[currentRole];
  };

  const [user, setUser] = useState<UserProfile | null>(() => loadProfile(role));

  useEffect(() => {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    setUser(loadProfile(role));
  }, [role]);

  const login = (newRole: UserRole) => {
    setRole(newRole);
  };

  const logout = () => {
    setRole(ROLES.FARMER);
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser: UserProfile = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(getProfileStorageKey(role), JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: true,
        login,
        logout,
        switchRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
