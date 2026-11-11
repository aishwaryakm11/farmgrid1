import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Package } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { resourceService } from "@/services/resourceService";
import { adminService } from "@/services/adminService";
import { Resource } from "@/types/resource";

export const AdminResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(resourceService.getAll());
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const owners = useMemo(() => adminService.getOwners(), []);

  useEffect(() => {
    const refresh = () => setResources(resourceService.getAll());
    window.addEventListener("farmgrid_resources_updated", refresh);
    return () => window.removeEventListener("farmgrid_resources_updated", refresh);
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(resources.map((r) => r.category)))], [resources]);
  const statuses = ["All", "Available", "Currently Booked", "Under Maintenance", "Broken Down", "Unavailable"];

  const filtered = useMemo(() =>
    resources.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch = r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) ||
        r.location_text.toLowerCase().includes(q);
      const matchCat = categoryFilter === "All" || r.category === categoryFilter;
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    }), [resources, search, categoryFilter, statusFilter]);

  const getOwnerName = (ownerId: string) => owners.find((o) => o.id === ownerId)?.full_name ?? ownerId;

  return (
    <div className="space-y-6">
      <PageHeader title="Resource Registry" description={`${resources.length} registered resources`} />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by name, ID or location…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/40" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/40">
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/40">
          {statuses.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="No resources found" description="Try changing your search or filters." />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Resource</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Owner</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Location</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Rate</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((res) => (
                <tr key={res.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{res.name}</p>
                    <p className="text-xs text-muted-foreground">{res.id} · {res.resource_type}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{res.category}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{getOwnerName(res.owner_id)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{res.location_text}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-right text-muted-foreground">
                    ₹{res.rental_price.toLocaleString("en-IN")}/{res.price_unit}
                  </td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={res.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
