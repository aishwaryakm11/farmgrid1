import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from '@/services/notificationService';
import { AppNotification } from '@/types/notification';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bell,
  CalendarCheck,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
  Check,
  ArrowRight,
  Tractor,
} from 'lucide-react';

export const OwnerNotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const ownerId = user?.id || 'owner-201';

  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    notificationService.getByUser(ownerId)
  );
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifs = () => {
    setNotifications(notificationService.getByUser(ownerId));
  };

  useEffect(() => {
    loadNotifs();
    window.addEventListener('farmgrid_notifications_updated', loadNotifs);
    return () => window.removeEventListener('farmgrid_notifications_updated', loadNotifs);
  }, [ownerId]);

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
    loadNotifs();
  };

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead(ownerId);
    loadNotifs();
  };

  const handleDelete = (id: string) => {
    notificationService.deleteNotification(id);
    loadNotifs();
  };

  const filtered =
    filter === 'unread' ? notifications.filter((n) => !n.read_at) : notifications;
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const getIcon = (category: string) => {
    switch (category) {
      case 'resource_allocated':
        return <CalendarCheck className="w-5 h-5 text-emerald-700" />;
      case 'resource_disruption':
        return <AlertTriangle className="w-5 h-5 text-amber-700" />;
      case 'booking_updated':
        return <Clock className="w-5 h-5 text-blue-700" />;
      default:
        return <Info className="w-5 h-5 text-farm-green" />;
    }
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffHours = Math.floor(diffMs / 3600000);
      if (diffHours < 1) return 'Just now';
      if (diffHours === 1) return '1 hour ago';
      if (diffHours < 24) return `${diffHours} hours ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays} days ago`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Owner Alerts & Dispatch Notifications"
        description="Operational updates, upcoming machine dispatch locks, and fleet maintenance alerts."
        badge={
          unreadCount > 0 ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              {unreadCount} Unread
            </span>
          ) : undefined
        }
        action={
          unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              Mark All Read
            </Button>
          )
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <Button
          variant={filter === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-farm-green text-white text-xs' : 'text-xs text-muted-foreground'}
        >
          All Notifications ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilter('unread')}
          className={filter === 'unread' ? 'bg-farm-green text-white text-xs' : 'text-xs text-muted-foreground'}
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyState
            title="No notifications"
            description={
              filter === 'unread'
                ? 'No unread fleet notifications.'
                : 'No notification records exist at this time.'
            }
            icon={Bell}
          />
        ) : (
          filtered.map((n) => (
            <Card
              key={n.id}
              className={`transition-all hover:border-farm-green/50 ${
                !n.read_at
                  ? 'border-emerald-200 bg-emerald-50/20 shadow-xs'
                  : 'border-border/70 bg-card'
              }`}
            >
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-farm-sage/50 shrink-0 mt-0.5">
                    {getIcon(n.category)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground">{n.title}</h4>
                      {!n.read_at && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-3 pt-2 text-[11px] text-muted-foreground">
                      <span>{formatTimeAgo(n.created_at)}</span>
                      {n.related_link && (
                        <button
                          onClick={() => {
                            if (!n.read_at) handleMarkAsRead(n.id);
                            navigate(n.related_link!);
                          }}
                          className="font-semibold text-farm-green hover:underline flex items-center gap-0.5"
                        >
                          <span>Open related view</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!n.read_at && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-xs text-muted-foreground hover:text-foreground h-8 px-2"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(n.id)}
                    className="text-xs text-muted-foreground hover:text-destructive h-8 px-2"
                    title="Delete notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
