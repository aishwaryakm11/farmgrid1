import React, { useEffect, useState, useMemo } from "react";
import { SlidersHorizontal, Info } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { requestService } from "@/services/requestService";
import { ResourceRequest } from "@/types/request";

const SCORE_FACTORS = [
  { key: "crop_criticality", label: "Crop Criticality", max: 25 },
  { key: "farm_size", label: "Farm Size", max: 20 },
  { key: "urgency", label: "Urgency", max: 20 },
  { key: "distance", label: "Distance", max: 15 },
  { key: "past_usage", label: "Past Usage", max: 10 },
  { key: "cooperative", label: "Cooperative Member", max: 10 },
];

export const PriorityRankingPage: React.FC = () => {
  const [requests, setRequests] = useState<ResourceRequest[]>(requestService.getAll());

  useEffect(() => {
    const refresh = () => setRequests(requestService.getAll());
    window.addEventListener("farmgrid_requests_updated", refresh);
    return () => window.removeEventListener("farmgrid_requests_updated", refresh);
  }, []);

  const ranked = useMemo(() =>
    [...requests]
      .filter((r) => ["Pending", "Waiting", "Scheduled"].includes(r.status))
      .sort((a, b) => (b.priority_score ?? 0) - (a.priority_score ?? 0)),
    [requests]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Priority Ranking"
        subtitle="Requests ranked by deterministic allocation score — no ML model used"
        actions={
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-border">
            <Info className="w-3.5 h-3.5" />
            Scores based on transparent rules
          </div>
        }
      />

      {/* Scoring Guide */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Scoring Factors (Total: 100 points)</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {SCORE_FACTORS.map((f) => (
            <div key={f.key} className="rounded-md bg-muted/40 p-2.5 text-center">
              <p className="text-lg font-bold text-farm-green">{f.max}</p>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5">{f.label}</p>
            </div>
          ))}
        </div>
      </div>

      {ranked.length === 0 ? (
        <EmptyState
          icon={<SlidersHorizontal className="w-8 h-8 text-muted-foreground" />}
          title="No active requests to rank"
          message="Pending, Waiting and Scheduled requests will appear here."
        />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-center w-12">Rank</th>
                <th className="px-4 py-3 text-left">Request</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Farmer / Village</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Resource</th>
                <th className="px-4 py-3 text-center hidden lg:table-cell">Urgency</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ranked.map((req, idx) => (
                <tr key={req.id} className={`hover:bg-muted/30 transition-colors ${idx === 0 ? "bg-farm-green/5" : ""}`}>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                      idx === 0 ? "bg-farm-green text-white" :
                      idx === 1 ? "bg-farm-sage text-farm-green-dark" :
                      idx === 2 ? "bg-amber-100 text-amber-700" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{req.id}</p>
                    <p className="text-xs text-muted-foreground">{new Date(req.requested_date).toLocaleDateString("en-IN")}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    <p>{req.farmer_name}</p><p className="text-xs">{req.village}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{req.resource_type}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      req.urgency_level === "Critical" ? "bg-red-100 text-red-700" :
                      req.urgency_level === "High" ? "bg-orange-100 text-orange-700" :
                      req.urgency_level === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{req.urgency_level}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg font-bold text-farm-green">{req.priority_score ?? "—"}</span>
                      {req.priority_score && (
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-farm-green rounded-full" style={{ width: `${req.priority_score}%` }} />
                        </div>
                      )}
                    </div>
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
