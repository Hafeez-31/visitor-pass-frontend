import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_ITEMS = {
  admin: [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/admin/employees', label: 'Manage Employees' },
    { to: '/admin/users', label: 'Manage User Accounts' },
    { to: '/admin/reports', label: 'Visitor Reports' },
    { to: '/admin/activity', label: 'Activity History' },
  ],
  receptionist: [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/reception/register', label: 'Register Visitor' },
    { to: '/reception/checkin', label: 'Check In' },
    { to: '/reception/checkout', label: 'Check Out' },
    { to: '/reception/history', label: 'Visitor History' },
  ],
  employee: [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/employee/requests', label: 'Visitor Requests' },
  ],
};

const ROLE_LABELS = {
  admin: 'Administrator',
  receptionist: 'Receptionist',
  employee: 'Employee',
};

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV_ITEMS[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="px-5 py-5 border-b border-slate-200">
          <h1 className="text-lg font-bold text-brand-700 leading-tight">Visitor Pass</h1>
          <p className="text-xs text-slate-500">Management System</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
          <p className="text-xs text-slate-500 mb-3">{ROLE_LABELS[user?.role] || user?.role}</p>
          <button onClick={handleLogout} className="btn-secondary w-full text-sm">
            Log Out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
