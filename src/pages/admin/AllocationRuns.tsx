import React, { useEffect, useState, useMemo } from "react";
import { CheckSquare, Info } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { bookingService } from "@/services/bookingService";
import { resourceService } from "@/services/resourceService";
import { Booking } from "@/types/booking";

export const AllocationRunsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(bookingService.getAll());

  useEffect(() => {
    const refresh = () => setBookings(bookingService.getAll());
    window.addEventListener("farmgrid_bookings_updated", refresh);
    return () => window.removeEventListener("farmgrid_bookings_updated", refresh);
  }, []);

  const resources = resourceService.getAll();
  const getResourceName = (id: string) => resources.find((r) => r.id === id)?.name ?? id;

  const confirmed = useMemo(() => bookings.filter((b) => b.status === "Confirmed"), [bookings]);
  const completed = useMemo(() => bookings.filter((b) => b.status === "Completed"), [bookings]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Allocation Results"
        subtitle="Bookings confirmed through the allocation process"
        actions={
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-border">
            <Info className="w-3.5 h-3.5" />
            Simulated allocation data
          </div>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: bookings.length, color: "text-foreground" },
          { label: "Confirmed", value: confirmed.length, color: "text-farm-green" },
          { label: "Completed", value: completed.length, color: "text-blue-600" },
          { label: "Other", value: bookings.length - confirmed.length - completed.length, color: "text-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {bookings.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-8 h-8 text-muted-foreground" />}
          title="No allocation results yet"
          message="Confirmed bookings will appear here after allocation runs."
        />
      ) : (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Booking</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Farmer</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Resource</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Period</th>
                <th className="px-4 py-3 text-center hidden lg:table-cell">Priority Score</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((bk) => (
                <tr key={bk.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{bk.id}</p>
                    <p className="text-xs text-muted-foreground">{bk.crop_name} · {bk.farm_size_acres}A</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    <p>{bk.farmer_name}</p><p className="text-xs">{bk.farmer_village}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                    <p>{getResourceName(bk.resource_id)}</p><p className="text-xs">{bk.resource_id}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                    <p>{new Date(bk.start_date).toLocaleDateString("en-IN")}</p>
                    <p>to {new Date(bk.end_date).toLocaleDateString("en-IN")}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-center">
                    <span className="font-semibold text-farm-green">{bk.priority_score ?? "—"}</span>
                  </td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={bk.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
