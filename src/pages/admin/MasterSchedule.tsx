import React, { useEffect, useState, useMemo } from "react";
import { CalendarDays, Info } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { bookingService } from "@/services/bookingService";
import { resourceService } from "@/services/resourceService";
import { Booking } from "@/types/booking";
import { Resource } from "@/types/resource";

export const MasterSchedulePage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(bookingService.getAll());
  const [resources, setResources] = useState<Resource[]>(resourceService.getAll());
  const [resourceFilter, setResourceFilter] = useState("All");

  useEffect(() => {
    const refreshBookings = () => setBookings(bookingService.getAll());
    const refreshResources = () => setResources(resourceService.getAll());
    window.addEventListener("farmgrid_bookings_updated", refreshBookings);
    window.addEventListener("farmgrid_resources_updated", refreshResources);
    return () => {
      window.removeEventListener("farmgrid_bookings_updated", refreshBookings);
      window.removeEventListener("farmgrid_resources_updated", refreshResources);
    };
  }, []);

  const resourceOptions = useMemo(() =>
    ["All", ...resources.map((r) => r.id)], [resources]);

  const filtered = useMemo(() =>
    bookings.filter((b) => resourceFilter === "All" || b.resource_id === resourceFilter),
    [bookings, resourceFilter]);

  const getResourceName = (id: string) => resources.find((r) => r.id === id)?.name ?? id;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Master Schedule"
        subtitle="All confirmed and historical bookings across resources"
        actions={
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-border">
            <Info className="w-3.5 h-3.5" />
            Simulated booking data
          </div>
        }
      />

      <div className="flex gap-3">
        <select value={resourceFilter} onChange={(e) => setResourceFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-farm-green/40">
          {resourceOptions.map((id) => (
            <option key={id} value={id}>{id === "All" ? "All Resources" : `${id} — ${getResourceName(id)}`}</option>
          ))}
        </select>
      </div>

      {/* Timeline view */}
      <div className="space-y-4">
        {resources.filter((r) => resourceFilter === "All" || r.id === resourceFilter).map((resource) => {
          const resBookings = filtered.filter((b) => b.resource_id === resource.id);
          return (
            <div key={resource.id} className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b border-border">
                <div>
                  <span className="text-sm font-semibold text-foreground">{resource.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{resource.id} · {resource.category}</span>
                </div>
                <StatusBadge status={resource.status} />
              </div>
              {resBookings.length === 0 ? (
                <p className="px-4 py-3 text-sm text-muted-foreground italic">No bookings for this resource.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-2 text-left">Booking ID</th>
                      <th className="px-4 py-2 text-left">Farmer</th>
                      <th className="px-4 py-2 text-left hidden md:table-cell">Start Date</th>
                      <th className="px-4 py-2 text-left hidden md:table-cell">End Date</th>
                      <th className="px-4 py-2 text-left hidden lg:table-cell">Crop / Acres</th>
                      <th className="px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {resBookings.map((bk) => (
                      <tr key={bk.id} className="hover:bg-muted/20">
                        <td className="px-4 py-2 font-medium text-foreground">{bk.id}</td>
                        <td className="px-4 py-2 text-muted-foreground">{bk.farmer_name}<br /><span className="text-xs">{bk.farmer_village}</span></td>
                        <td className="px-4 py-2 hidden md:table-cell text-muted-foreground">{new Date(bk.start_date).toLocaleDateString("en-IN")}</td>
                        <td className="px-4 py-2 hidden md:table-cell text-muted-foreground">{new Date(bk.end_date).toLocaleDateString("en-IN")}</td>
                        <td className="px-4 py-2 hidden lg:table-cell text-muted-foreground">{bk.crop_name} · {bk.farm_size_acres}A</td>
                        <td className="px-4 py-2 text-center"><StatusBadge status={bk.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>

      {resources.length === 0 && (
        <EmptyState icon={<CalendarDays className="w-8 h-8 text-muted-foreground" />} title="No resources registered" message="Resources registered by owners will appear here." />
      )}
    </div>
  );
};
