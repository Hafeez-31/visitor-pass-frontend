import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import ManageEmployees from './pages/admin/ManageEmployees.jsx';
import ManageUsers from './pages/admin/ManageUsers.jsx';
import VisitorReports from './pages/admin/VisitorReports.jsx';
import ActivityHistory from './pages/admin/ActivityHistory.jsx';

import RegisterVisitor from './pages/receptionist/RegisterVisitor.jsx';
import CheckIn from './pages/receptionist/CheckIn.jsx';
import CheckOut from './pages/receptionist/CheckOut.jsx';
import VisitorHistory from './pages/receptionist/VisitorHistory.jsx';

import VisitorRequests from './pages/employee/VisitorRequests.jsx';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Dashboard /> : <Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageEmployees />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <VisitorReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/activity"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ActivityHistory />
          </ProtectedRoute>
        }
      />

      {/* Receptionist routes */}
      <Route
        path="/reception/register"
        element={
          <ProtectedRoute allowedRoles={['receptionist']}>
            <RegisterVisitor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/checkin"
        element={
          <ProtectedRoute allowedRoles={['receptionist']}>
            <CheckIn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/checkout"
        element={
          <ProtectedRoute allowedRoles={['receptionist']}>
            <CheckOut />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reception/history"
        element={
          <ProtectedRoute allowedRoles={['receptionist']}>
            <VisitorHistory />
          </ProtectedRoute>
        }
      />

      {/* Employee routes */}
      <Route
        path="/employee/requests"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <VisitorRequests />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
