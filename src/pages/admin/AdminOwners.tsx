import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserCheck, UserX, Users } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { adminService } from "@/services/adminService";
import { resourceService } from "@/services/resourceService";
import { UserProfile } from "@/types/user";

export const AdminOwnersPage: React.FC = () => {
  const navigate = useNavigate();
  const [owners, setOwners] = useState<UserProfile[]>(adminService.getOwners());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setOwners(adminService.getOwners());
    window.addEventListener("farmgrid_users_updated", refresh);
    return () => window.removeEventListener("farmgrid_users_updated", refresh);
  }, []);

  const allResources = useMemo(() => resourceService.getAll(), []);

  const filtered = useMemo(() =>
    owners.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch = o.full_name.toLowerCase().includes(q) ||
        (o.village ?? "").toLowerCase().includes(q) ||
        (o.depot_name ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || o.status === statusFilter;
      return matchSearch && matchStatus;
    }), [owners, search, statusFilter]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleToggle = (id: string) => {
    const updated = adminService.toggleOwnerStatus(id);
    if (updated) { setOwners(adminService.getOwners()); showToast(`${updated.full_name} is now ${updated.status}`); }
    setConfirmId(null);
  };

  const targetOwner = confirmId ? owners.find((o) => o.id === confirmId) : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Owner Management" description={`${owners.length} registered resource owners`} />

      {toast && (
        <div className="rounded-md bg-farm-green/10 border border-farm-green/30 text-farm-green text-sm px-4 py-2">{toast}</div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by name, location or depot…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/40" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "All" | "Active" | "Inactive")}
          className="px-3 py-2 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/40">
          <option>All</option><option>Active</option><option>Inactive</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No owners found" description="Try changing your search or filter." />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Owner</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Depot / Location</th>
                <th className="px-4 py-3 text-center">Resources</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((owner) => {
                const count = allResources.filter((r) => r.owner_id === owner.id).length;
                return (
                  <tr key={owner.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{owner.full_name}</p>
                      <p className="text-xs text-muted-foreground">{owner.email}</p>
                      <p className="text-xs text-muted-foreground">{owner.phone}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                      <p>{owner.depot_name ?? "—"}</p>
                      <p className="text-xs">{owner.village}, {owner.district}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => navigate("/admin/resources")} className="text-farm-green font-semibold hover:underline">{count}</button>
                    </td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={owner.status ?? "Active"} /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setConfirmId(owner.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${owner.status === "Active" ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-farm-sage text-farm-green-dark hover:bg-farm-sage-dark"}`}>
                        {owner.status === "Active" ? <><UserX className="w-3.5 h-3.5" />Deactivate</> : <><UserCheck className="w-3.5 h-3.5" />Activate</>}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {confirmId && targetOwner && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setConfirmId(null)}>
          <div className="bg-card rounded-xl border border-border shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-foreground mb-2">
              {targetOwner.status === "Active" ? "Deactivate Owner?" : "Activate Owner?"}
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              {targetOwner.full_name} will be {targetOwner.status === "Active" ? "deactivated and their resources hidden from allocation" : "reactivated on the platform"}.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmId(null)} className="px-4 py-2 rounded-md border border-border text-sm hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => handleToggle(confirmId)}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${targetOwner.status === "Active" ? "bg-red-600 hover:bg-red-700" : "bg-farm-green hover:bg-farm-green-dark"}`}>
                {targetOwner.status === "Active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
