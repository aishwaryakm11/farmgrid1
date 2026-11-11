import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserCheck, UserX, Users } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { adminService } from "@/services/adminService";
import { requestService } from "@/services/requestService";
import { UserProfile } from "@/types/user";

export const AdminFarmersPage: React.FC = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState<UserProfile[]>(adminService.getFarmers());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setFarmers(adminService.getFarmers());
    window.addEventListener("farmgrid_users_updated", refresh);
    return () => window.removeEventListener("farmgrid_users_updated", refresh);
  }, []);

  const allRequests = useMemo(() => requestService.getAll(), []);

  const filtered = useMemo(() =>
    farmers.filter((f) => {
      const q = search.toLowerCase();
      const matchSearch = f.full_name.toLowerCase().includes(q) ||
        (f.village ?? "").toLowerCase().includes(q) ||
        (f.district ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || f.status === statusFilter;
      return matchSearch && matchStatus;
    }), [farmers, search, statusFilter]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleToggle = (id: string) => {
    const updated = adminService.toggleFarmerStatus(id);
    if (updated) { setFarmers(adminService.getFarmers()); showToast(`${updated.full_name} is now ${updated.status}`); }
    setConfirmId(null);
  };

  const targetFarmer = confirmId ? farmers.find((f) => f.id === confirmId) : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Farmer Management" description={`${farmers.length} registered farmers`} />

      {toast && (
        <div className="rounded-md bg-farm-green/10 border border-farm-green/30 text-farm-green text-sm px-4 py-2">{toast}</div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by name, village or district…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/40" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "All" | "Active" | "Inactive")}
          className="px-3 py-2 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/40">
          <option>All</option><option>Active</option><option>Inactive</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No farmers found" description="Try changing your search or filter." />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Farmer</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Location</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Farm / Crop</th>
                <th className="px-4 py-3 text-center">Requests</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((farmer) => {
                const count = allRequests.filter((r) => r.farmer_id === farmer.id).length;
                return (
                  <tr key={farmer.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{farmer.full_name}</p>
                      <p className="text-xs text-muted-foreground">{farmer.email}</p>
                      <p className="text-xs text-muted-foreground">{farmer.phone}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                      <p>{farmer.village}</p><p className="text-xs">{farmer.district}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                      <p>{farmer.farm_size_acres} acres</p><p className="text-xs">{farmer.crop_name}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => navigate("/admin/requests")} className="text-farm-green font-semibold hover:underline">{count}</button>
                    </td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={farmer.status ?? "Active"} /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setConfirmId(farmer.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${farmer.status === "Active" ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-farm-sage text-farm-green-dark hover:bg-farm-sage-dark"}`}>
                        {farmer.status === "Active" ? <><UserX className="w-3.5 h-3.5" />Deactivate</> : <><UserCheck className="w-3.5 h-3.5" />Activate</>}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Inline confirm panel (avoid ConfirmDialog prop mismatch) */}
      {confirmId && targetFarmer && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setConfirmId(null)}>
          <div className="bg-card rounded-xl border border-border shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-foreground mb-2">
              {targetFarmer.status === "Active" ? "Deactivate Farmer?" : "Activate Farmer?"}
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              {targetFarmer.full_name} will be {targetFarmer.status === "Active" ? "deactivated and unable to submit new requests" : "reactivated on the platform"}.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmId(null)} className="px-4 py-2 rounded-md border border-border text-sm hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => handleToggle(confirmId)}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${targetFarmer.status === "Active" ? "bg-red-600 hover:bg-red-700" : "bg-farm-green hover:bg-farm-green-dark"}`}>
                {targetFarmer.status === "Active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
