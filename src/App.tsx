import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ROLES } from '@/lib/constants';

// Public Pages
import { IndexPage } from '@/pages/Index';
import { LoginPage } from '@/pages/Login';
import { RegisterPage } from '@/pages/Register';
import { NotFoundPage } from '@/pages/NotFound';

// Farmer Pages
import { FarmerDashboard } from '@/pages/farmer/FarmerDashboard';
import { NewRequestPage } from '@/pages/farmer/NewRequest';
import { MyRequestsPage } from '@/pages/farmer/MyRequests';
import { RequestDetailsPage } from '@/pages/farmer/RequestDetails';
import { AllocationResultsPage } from '@/pages/farmer/AllocationResults';
import { NotificationsPage } from '@/pages/farmer/Notifications';
import { FarmerProfilePage } from '@/pages/farmer/FarmerProfile';

// Owner Pages
import { OwnerDashboard } from '@/pages/owner/OwnerDashboard';
import { MyResourcesPage } from '@/pages/owner/MyResources';
import { AddResourcePage } from '@/pages/owner/AddResource';
import { EditResourcePage } from '@/pages/owner/EditResource';
import { ResourceDetailsPage } from '@/pages/owner/ResourceDetails';
import { AvailabilityManagementPage } from '@/pages/owner/AvailabilityManagement';
import { OwnerCalendarPage } from '@/pages/owner/OwnerCalendar';
import { BookingsPage } from '@/pages/owner/Bookings';
import { ReportDisruptionPage } from '@/pages/owner/ReportDisruption';
import { OwnerNotificationsPage } from '@/pages/owner/OwnerNotifications';
import { OwnerProfilePage } from '@/pages/owner/OwnerProfile';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { MasterSchedulePage } from '@/pages/admin/MasterSchedule';
import { AllRequestsPage } from '@/pages/admin/AllRequests';
import { AllocationRunsPage } from '@/pages/admin/AllocationRuns';
import { DisruptionsPage } from '@/pages/admin/Disruptions';
import { UserManagementPage } from '@/pages/admin/UserManagement';
import { AdminFarmersPage } from '@/pages/admin/AdminFarmers';
import { AdminOwnersPage } from '@/pages/admin/AdminOwners';
import { AdminResourcesPage } from '@/pages/admin/AdminResources';
import { PriorityRankingPage } from '@/pages/admin/PriorityRanking';
import { AdminNotificationsPage } from '@/pages/admin/AdminNotifications';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated Application Shell */}
          <Route element={<AppLayout />}>
            {/* Farmer Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.FARMER]} />}>
              <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
              <Route path="/farmer/new-request" element={<NewRequestPage />} />
              <Route path="/farmer/my-requests" element={<MyRequestsPage />} />
              <Route path="/farmer/request/:id" element={<RequestDetailsPage />} />
              <Route path="/farmer/allocations" element={<AllocationResultsPage />} />
              <Route path="/farmer/notifications" element={<NotificationsPage />} />
              <Route path="/farmer/profile" element={<FarmerProfilePage />} />
            </Route>

            {/* Owner Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.OWNER]} />}>
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              <Route path="/owner/resources" element={<MyResourcesPage />} />
              <Route path="/owner/add-resource" element={<AddResourcePage />} />
              <Route path="/owner/edit-resource/:id" element={<EditResourcePage />} />
              <Route path="/owner/resource/:id" element={<ResourceDetailsPage />} />
              <Route path="/owner/availability" element={<AvailabilityManagementPage />} />
              <Route path="/owner/calendar" element={<OwnerCalendarPage />} />
              <Route path="/owner/bookings" element={<BookingsPage />} />
              <Route path="/owner/disruption" element={<ReportDisruptionPage />} />
              <Route path="/owner/notifications" element={<OwnerNotificationsPage />} />
              <Route path="/owner/profile" element={<OwnerProfilePage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/schedule" element={<MasterSchedulePage />} />
              <Route path="/admin/requests" element={<AllRequestsPage />} />
              <Route path="/admin/priority" element={<PriorityRankingPage />} />
              <Route path="/admin/allocation-runs" element={<AllocationRunsPage />} />
              <Route path="/admin/disruptions" element={<DisruptionsPage />} />
              <Route path="/admin/farmers" element={<AdminFarmersPage />} />
              <Route path="/admin/owners" element={<AdminOwnersPage />} />
              <Route path="/admin/resources" element={<AdminResourcesPage />} />
              <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
            </Route>

            {/* Generic Redirects for Root Role Paths */}
            <Route path="/farmer" element={<Navigate to="/farmer/dashboard" replace />} />
            <Route path="/owner" element={<Navigate to="/owner/dashboard" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
