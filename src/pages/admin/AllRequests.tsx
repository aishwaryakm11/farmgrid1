import React, { useEffect, useState, useMemo } from "react";
import { Search, ClipboardList, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { requestService } from "@/services/requestService";
import { ResourceRequest } from "@/types/request";

type TabType = "All" | "Pending" | "Scheduled" | "Waiting" | "Conflicts";

export const AllRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<ResourceRequest[]>(requestService.getAll());
  const [tab, setTab] = useState<TabType>("All");
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("All");

  useEffect(() => {
    const refresh = () => setRequests(requestService.getAll());
    window.addEventListener("farmgrid_requests_updated", refresh);
    return () => window.removeEventListener("farmgrid_requests_updated", refresh);
  }, []);

  // Conflict detection: same resource_type with overlapping date ranges
  const conflicts = useMemo(() => {
    const active = requests.filter((r) => ["Pending", "Waiting", "Scheduled"].includes(r.status));
    const conflictSet = new Set<string>();
    for (let i = 0; i < active.length; i++) {
      for (let j = i + 1; j < active.length; j++) {
        const a = active[i]; const b = active[j];
        if (a.resource_type === b.resource_type) {
          const aStart = new Date(a.earliest_start); const aEnd = new Date(a.latest_end);
          const bStart = new Date(b.earliest_start); const bEnd = new Date(b.latest_end);
          if (aStart <= bEnd && bStart <= aEnd) { conflictSet.add(a.id); conflictSet.add(b.id); }
        }
      }
    }
    return conflictSet;
  }, [requests]);

  const filtered = useMemo(() => {
    let list = requests;
    if (tab === "Conflicts") list = requests.filter((r) => conflicts.has(r.id));
    else if (tab !== "All") list = requests.filter((r) => r.status === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.id.toLowerCase().includes(q) ||
        (r.farmer_name ?? "").toLowerCase().includes(q) ||
        r.farm_location.toLowerCase().includes(q) ||
        r.resource_type.toLowerCase().includes(q));
    }
    if (urgencyFilter !== "All") list = list.filter((r) => r.urgency_level === urgencyFilter);
    return list;
  }, [requests, tab, search, urgencyFilter, conflicts]);

  const tabs: { key: TabType; label: string }[] = [
    { key: "All", label: `All (${requests.length})` },
    { key: "Pending", label: `Pending (${requests.filter((r) => r.status === "Pending").length})` },
    { key: "Scheduled", label: `Scheduled (${requests.filter((r) => r.status === "Scheduled").length})` },
    { key: "Waiting", label: `Waiting (${requests.filter((r) => r.status === "Waiting").length})` },
    { key: "Conflicts", label: `Conflicts (${conflicts.size})` },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="All Requests" description="Review and monitor all farmer resource requests" />

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t.key ? "border-farm-green text-farm-green" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.key === "Conflicts" && conflicts.size > 0 && <AlertTriangle className="inline w-3.5 h-3.5 mr-1 text-amber-500" />}
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Search by ID, farmer, location or resource type…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/40" />
        </div>
        <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/40">
          <option value="All">All Urgency</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Moderate">Moderate</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No requests found" description="Try changing the tab or search filters." />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Request</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Farmer</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Resource</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Window</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((req) => (
                <tr key={req.id} className={`hover:bg-muted/30 transition-colors ${conflicts.has(req.id) ? "bg-amber-50/50" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {conflicts.has(req.id) && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                      <div>
                        <p className="font-medium text-foreground">{req.id}</p>
                        <p className="text-xs text-muted-foreground capitalize">{req.urgency_level} urgency</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    <p>{req.farmer_name ?? req.farmer_id}</p>
                    <p className="text-xs">{req.farm_location}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{req.resource_type}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    <p>{new Date(req.earliest_start).toLocaleDateString("en-IN")}</p>
                    <p>to {new Date(req.latest_end).toLocaleDateString("en-IN")}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-farm-green">{req.priority_score ?? "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={req.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
