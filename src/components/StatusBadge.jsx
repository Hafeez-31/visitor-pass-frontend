import React from 'react';

const STYLES = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-800',
  'checked-in': 'bg-emerald-100 text-emerald-800',
  'checked-out': 'bg-slate-200 text-slate-700',
  cancelled: 'bg-slate-100 text-slate-500 line-through',
};

const LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  'checked-in': 'Checked In',
  'checked-out': 'Checked Out',
  cancelled: 'Cancelled',
};

const StatusBadge = ({ status }) => (
  <span className={`badge ${STYLES[status] || 'bg-slate-100 text-slate-600'}`}>
    {LABELS[status] || status}
  </span>
);

export default StatusBadge;
