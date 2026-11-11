import React, { useEffect, useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { notificationService } from "@/services/notificationService";
import { AppNotification } from "@/types/notification";

const ADMIN_ID = "admin-001";

const ADMIN_SEED = [
  {
    user_id: ADMIN_ID,
    category: "system_alert" as const,
    title: "New Farmer Registration",
    message: "Kishore Deshmukh (farmer-104) registered from Bhor Valley, Pune. Profile pending verification.",
    type: "info" as const,
    related_link: "/admin/farmers",
  },
  {
    user_id: ADMIN_ID,
    category: "disruption" as const,
    title: "Active Disruption Reported",
    message: "Owner Suresh Shinde reported a maintenance disruption on Kirloskar Pump (DIS-01). 1 booking affected.",
    type: "warning" as const,
    related_link: "/admin/disruptions",
  },
  {
    user_id: ADMIN_ID,
    category: "allocation_result" as const,
    title: "Allocation Confirmed",
    message: "Booking BK-9042 confirmed for Ramesh Patel — Combine Harvester H-02 (5–9 Jun 2026).",
    type: "success" as const,
    related_link: "/admin/allocation-runs",
  },
];

let adminSeeded = false;
function ensureAdminSeed() {
  if (adminSeeded) return;
  adminSeeded = true;
  const existing = notificationService.getByUser(ADMIN_ID);
  if (existing.length === 0) {
    ADMIN_SEED.forEach((n) => notificationService.addNotification(n));
  }
}

const typeStyles: Record<string, string> = {
  info: "border-l-blue-500 bg-blue-50/40",
  warning: "border-l-amber-500 bg-amber-50/40",
  success: "border-l-farm-green bg-farm-green/5",
  error: "border-l-red-500 bg-red-50/40",
};

export const AdminNotificationsPage: React.FC = () => {
  ensureAdminSeed();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const reload = () => setNotifications(notificationService.getByUser(ADMIN_ID));

  useEffect(() => {
    reload();
    window.addEventListener("farmgrid_notifications_updated", reload);
    return () => window.removeEventListener("farmgrid_notifications_updated", reload);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const handleMarkAll = () => {
    notificationService.markAllAsRead(ADMIN_ID);
    reload();
  };

  const handleMarkOne = (id: string) => {
    notificationService.markAsRead(id);
    reload();
  };

  const handleDelete = (id: string) => {
    notificationService.deleteNotification(id);
    reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
        actions={
          unreadCount > 0 ? (
            <button onClick={handleMarkAll}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-border bg-card hover:bg-muted transition-colors">
              <CheckCheck className="w-4 h-4" />Mark all read
            </button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8 text-muted-foreground" />}
          title="No notifications"
          message="System and allocation notifications will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id}
              className={`rounded-lg border-l-4 border border-border p-4 flex items-start justify-between gap-4 ${typeStyles[n.type] ?? ""} ${!n.read_at ? "shadow-sm" : "opacity-70"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  {!n.read_at && (
                    <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-farm-green text-white">New</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {new Date(n.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!n.read_at && (
                  <button onClick={() => handleMarkOne(n.id)}
                    className="text-xs text-farm-green hover:underline whitespace-nowrap">Mark read</button>
                )}
                <button onClick={() => handleDelete(n.id)}
                  className="text-muted-foreground hover:text-red-600 transition-colors" aria-label="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
