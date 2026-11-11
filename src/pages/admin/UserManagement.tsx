import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export const UserManagementPage: React.FC = () => {
  const users = [
    {
      id: 'USR-01',
      name: 'Ramesh Patel',
      role: 'farmer',
      village: 'Khed Shivapur, Pune',
      farmSize: '12 Acres (Soybean)',
      status: 'Active',
    },
    {
      id: 'USR-02',
      name: 'Suresh Shinde',
      role: 'owner',
      village: 'Shirwal Agro Hub',
      farmSize: '3 Machines Listed',
      status: 'Active',
    },
    {
      id: 'USR-03',
      name: 'Sanjay Jadhav',
      role: 'farmer',
      village: 'Shirwal South',
      farmSize: '8 Acres (Soybean)',
      status: 'Active',
    },
    {
      id: 'USR-04',
      name: 'Vikramjit Deshmukh',
      role: 'admin',
      village: 'District Operations Desk',
      farmSize: 'System Administrator',
      status: 'Active',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User & Farm Registry"
        description="Directory of regional agricultural producers, equipment depot owners, and system operators."
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>System Role</TableHead>
                <TableHead>Village / Operations Base</TableHead>
                <TableHead>Farm / Fleet Details</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-mono text-xs font-semibold">{u.id}</TableCell>
                  <TableCell className="font-medium text-foreground">{u.name}</TableCell>
                  <TableCell>
                    <span className="capitalize font-semibold text-xs px-2 py-0.5 rounded bg-muted">
                      {u.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.village}</TableCell>
                  <TableCell className="text-xs">{u.farmSize}</TableCell>
                  <TableCell>
                    <StatusBadge status={u.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
