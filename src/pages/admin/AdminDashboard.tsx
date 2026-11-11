import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Users, ClipboardList, CalendarCheck, AlertOctagon,
  TrendingUp, UserCheck, Package,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { adminService } from "@/services/adminService";

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(adminService.getAdminStats());
  const demandData = adminService.getDemandByCategoryData();
  const statusData = adminService.getRequestStatusData();

  useEffect(() => {
    const refresh = () => setStats(adminService.getAdminStats());
    const events = ["farmgrid_requests_updated", "farmgrid_bookings_updated", "farmgrid_disruptions_updated", "farmgrid_users_updated"];
    events.forEach((e) => window.addEventListener(e, refresh));
    return () => events.forEach((e) => window.removeEventListener(e, refresh));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Overview"
        description="Platform-wide summary — simulated data"
        action={
          <button
            onClick={() => navigate("/admin/schedule")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-farm-green text-white text-sm font-medium hover:bg-farm-green-dark transition-colors"
          >
            <CalendarCheck className="w-4 h-4" />
            View Master Schedule
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div onClick={() => navigate("/admin/farmers")} className="cursor-pointer">
          <StatCard label="Total Farmers" value={stats.totalFarmers} icon={Users} subtext={`${stats.activeFarmers} active`} />
        </div>
        <div onClick={() => navigate("/admin/owners")} className="cursor-pointer">
          <StatCard label="Total Owners" value={stats.totalOwners} icon={UserCheck} subtext={`${stats.activeOwners} active`} />
        </div>
        <div onClick={() => navigate("/admin/resources")} className="cursor-pointer">
          <StatCard label="Resources" value={stats.totalResources} icon={Package} subtext={`${stats.activeResources} in service`} />
        </div>
        <div onClick={() => navigate("/admin/requests")} className="cursor-pointer">
          <StatCard label="Pending Requests" value={stats.pendingRequests} icon={ClipboardList} variant="warning" />
        </div>
        <div onClick={() => navigate("/admin/schedule")} className="cursor-pointer">
          <StatCard label="Confirmed Bookings" value={stats.scheduledBookings} icon={CalendarCheck} variant="success" />
        </div>
        <div onClick={() => navigate("/admin/disruptions")} className="cursor-pointer">
          <StatCard label="Active Disruptions" value={stats.activeDisruptions} icon={AlertOctagon} variant="danger" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-farm-green" />
            <h3 className="text-sm font-semibold">Resource Demand by Category</h3>
            <span className="ml-auto text-xs text-muted-foreground italic">Simulated</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={demandData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="demand" radius={[4, 4, 0, 0]}>
                {demandData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-4 h-4 text-farm-green" />
            <h3 className="text-sm font-semibold">Request Status Distribution</h3>
            <span className="ml-auto text-xs text-muted-foreground italic">Simulated</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Manage Farmers", desc: "View and toggle farmer status", to: "/admin/farmers", color: "text-farm-green" },
          { label: "Manage Owners", desc: "View owners and their resources", to: "/admin/owners", color: "text-blue-600" },
          { label: "All Resources", desc: "Browse registered equipment", to: "/admin/resources", color: "text-purple-600" },
          { label: "Disruptions Log", desc: "Review active disruptions", to: "/admin/disruptions", color: "text-red-600" },
        ].map((item) => (
          <button key={item.to} onClick={() => navigate(item.to)}
            className="rounded-lg border border-border bg-card p-4 text-left hover:border-farm-green/50 hover:shadow-sm transition-all">
            <p className={`text-sm font-semibold ${item.color}`}>{item.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
