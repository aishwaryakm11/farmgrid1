import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLogo } from '@/components/common/AppLogo';
import { ROLES } from '@/lib/constants';
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  CalendarDays,
  Wrench,
  AlertOctagon,
  Users,
  Settings,
  LogOut,
  SlidersHorizontal,
  FolderKanban,
  CheckSquare,
  Home,
  Shield,
  Tractor,
  Layers,
  CalendarCheck,
  Bell,
  Sliders,
  UserCheck,
  Package,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();

  const farmerNav = [
    { label: 'Farmer Dashboard', to: '/farmer/dashboard', icon: LayoutDashboard },
    { label: 'New Request', to: '/farmer/new-request', icon: PlusCircle },
    { label: 'My Requests', to: '/farmer/my-requests', icon: ClipboardList },
    { label: 'Allocation Results', to: '/farmer/allocations', icon: CalendarCheck },
    { label: 'Notifications', to: '/farmer/notifications', icon: Bell },
    { label: 'Profile & Farm', to: '/farmer/profile', icon: Settings },
  ];

  const ownerNav = [
    { label: 'Owner Dashboard', to: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'My Resources', to: '/owner/resources', icon: Tractor },
    { label: 'Add Resource', to: '/owner/add-resource', icon: PlusCircle },
    { label: 'Availability', to: '/owner/availability', icon: Sliders },
    { label: 'Resource Calendar', to: '/owner/calendar', icon: CalendarDays },
    { label: 'Bookings', to: '/owner/bookings', icon: CalendarCheck },
    { label: 'Report Disruption', to: '/owner/disruption', icon: AlertOctagon },
    { label: 'Notifications', to: '/owner/notifications', icon: Bell },
    { label: 'Owner Profile', to: '/owner/profile', icon: Settings },
  ];

  const adminNav = [
    { label: 'Admin Overview', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Master Schedule', to: '/admin/schedule', icon: CalendarDays },
    { label: 'All Requests', to: '/admin/requests', icon: Layers },
    { label: 'Priority Ranking', to: '/admin/priority', icon: SlidersHorizontal },
    { label: 'Allocation Results', to: '/admin/allocation-runs', icon: CheckSquare },
    { label: 'Disruptions Log', to: '/admin/disruptions', icon: AlertOctagon },
    { label: 'Farmers', to: '/admin/farmers', icon: Users },
    { label: 'Owners', to: '/admin/owners', icon: UserCheck },
    { label: 'Resources', to: '/admin/resources', icon: Package },
    { label: 'Notifications', to: '/admin/notifications', icon: Bell },
  ];

  const currentNav =
    role === ROLES.ADMIN ? adminNav : role === ROLES.OWNER ? ownerNav : farmerNav;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden backdrop-blur-xs"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center px-6 border-b border-border/80">
          <AppLogo showTagline={true} to="/" />
        </div>

        {/* Role badge */}
        <div className="px-6 py-3 bg-muted/40 border-b border-border/50 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Current Portal
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-farm-sage text-farm-green-dark capitalize">
            {role}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-farm-green text-white shadow-xs font-semibold'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Quick links & Sign out */}
        <div className="p-3 border-t border-border space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Public Home</span>
          </NavLink>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
