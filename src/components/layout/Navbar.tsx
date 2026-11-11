import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Menu, User, Shield, Tractor, UserCheck } from 'lucide-react';
import { ROLES, UserRole } from '@/lib/constants';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, role, switchRole } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 sm:px-6 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-muted md:hidden text-foreground"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span>FarmGrid Operations</span>
          <span>/</span>
          <span className="capitalize text-foreground font-semibold">
            {role === ROLES.ADMIN ? 'Administrator Control' : role === ROLES.OWNER ? 'Resource Owner Portal' : 'Farmer Portal'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Switcher Pill for Demo */}
        <div className="flex items-center bg-muted/70 p-1 rounded-lg text-xs font-medium border border-border">
          <span className="text-[11px] font-semibold text-muted-foreground px-2 hidden lg:inline">
            DEMO ROLE:
          </span>
          <button
            onClick={() => switchRole(ROLES.FARMER)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              role === ROLES.FARMER
                ? 'bg-farm-green text-white font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Farmer</span>
          </button>
          <button
            onClick={() => switchRole(ROLES.OWNER)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              role === ROLES.OWNER
                ? 'bg-farm-green text-white font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Tractor className="w-3.5 h-3.5" />
            <span>Owner</span>
          </button>
          <button
            onClick={() => switchRole(ROLES.ADMIN)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              role === ROLES.ADMIN
                ? 'bg-farm-green text-white font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Notifications Icon with Unread Count */}
        <button
          onClick={() => {
            if (role === ROLES.FARMER) navigate('/farmer/notifications');
            else if (role === ROLES.OWNER) navigate('/owner/notifications');
          }}
          className="relative p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-farm-sage flex items-center justify-center text-farm-green font-bold text-xs">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-foreground line-clamp-1">
              {user?.full_name}
            </span>
            <span className="text-[10px] text-muted-foreground capitalize">
              {role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
