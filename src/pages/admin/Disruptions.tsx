import React, { useEffect, useState, useMemo } from "react";
import { AlertOctagon, Search } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { disruptionService } from "@/services/disruptionService";
import { adminService } from "@/services/adminService";
import { DisruptionRecord } from "@/types/allocation";

export const DisruptionsPage: React.FC = () => {
  const [disruptions, setDisruptions] = useState<DisruptionRecord[]>(disruptionService.getAll());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState<string | null>(null);

  const owners = useMemo(() => adminService.getOwners(), []);

  useEffect(() => {
    const refresh = () => setDisruptions(disruptionService.getAll());
    window.addEventListener("farmgrid_disruptions_updated", refresh);
    return () => window.removeEventListener("farmgrid_disruptions_updated", refresh);
  }, []);

  const filtered = useMemo(() => {
    return disruptions.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch = d.id.toLowerCase().includes(q) || d.description.toLowerCase().includes(q) ||
        d.disruption_type.toLowerCase().includes(q) || d.owner_id.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [disruptions, search, statusFilter]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleResolve = (id: string) => {
    disruptionService.resolveDisruption(id);
    setDisruptions(disruptionService.getAll());
    showToast("Disruption marked as Resolved.");
  };

  const getOwnerName = (ownerId: string) => owners.find((o) => o.id === ownerId)?.full_name ?? ownerId;

  const active = disruptions.filter((d) => d.status === "Active").length;
  const resolved = disruptions.filter((d) => d.status === "Resolved").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Disruptions Log" subtitle="All reported equipment and logistics disruptions" />

      {toast && (
        <div className="rounded-md bg-farm-green/10 border border-farm-green/30 text-farm-green text-sm px-4 py-2">{toast}</div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{disruptions.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Disruptions</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{active}</p>
          <p className="text-xs text-red-600 mt-1">Active</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
          <p className="text-2xl font-bold text-farm-green">{resolved}</p>
          <p className="text-xs text-farm-green mt-1">Resolved</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by ID, type or description…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/40" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/40">
          <option>All</option><option>Active</option><option>Resolved</option><option>Rescheduling Required</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<AlertOctagon className="w-8 h-8 text-muted-foreground" />}
          title="No disruptions found"
          message="Reported disruptions will appear here."
        />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Disruption</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Owner</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Description</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">Affected Bookings</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Reported</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{d.id}</p>
                    <p className="text-xs text-muted-foreground">{d.disruption_type}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{getOwnerName(d.owner_id)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground max-w-xs">
                    <p className="truncate">{d.description}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-center text-muted-foreground">
                    {d.affected_bookings_count ?? 0}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    {new Date(d.reported_at).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3 text-right">
                    {d.status === "Active" && (
                      <button onClick={() => handleResolve(d.id)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-farm-sage text-farm-green-dark hover:bg-farm-sage-dark transition-colors">
                        Mark Resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
