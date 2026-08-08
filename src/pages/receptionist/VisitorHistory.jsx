import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../api/axios';

const VisitorHistory = () => {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({ visitorName: '', employeeName: '', visitDate: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const { data } = await api.get('/requests', { params });
      setRequests(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load visitor history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    load();
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this visit request?')) return;
    setCancellingId(id);
    try {
      await api.put(`/requests/${id}/cancel`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel request');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <Layout>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Visitor History</h2>

      <form onSubmit={handleFilter} className="card mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="label">Visitor Name</label>
            <input className="input" value={filters.visitorName} onChange={(e) => setFilters({ ...filters, visitorName: e.target.value })} />
          </div>
          <div>
            <label className="label">Employee Name</label>
            <input className="input" value={filters.employeeName} onChange={(e) => setFilters({ ...filters, employeeName: e.target.value })} />
          </div>
          <div>
            <label className="label">Visit Date</label>
            <input type="date" className="input" value={filters.visitDate} onChange={(e) => setFilters({ ...filters, visitDate: e.target.value })} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full" type="submit">Search</button>
          </div>
        </div>
      </form>

      {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg border border-red-200 mb-4">{error}</div>}

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-left">
              <tr>
                <th className="px-4 py-3">Visitor</th>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Visit Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Check-In</th>
                <th className="px-4 py-3">Check-Out</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800">{r.visitor?.name}</div>
                    <div className="text-xs text-slate-500">{r.visitor?.phone}</div>
                  </td>
                  <td className="px-4 py-3">{r.employee?.name}</td>
                  <td className="px-4 py-3">{new Date(r.visitDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : '—'}</td>
                  <td className="px-4 py-3">{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : '—'}</td>
                  <td className="px-4 py-3">
                    {['pending', 'approved'].includes(r.status) && (
                      <button
                        className="text-red-600 hover:underline text-xs"
                        disabled={cancellingId === r._id}
                        onClick={() => handleCancel(r._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400">No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default VisitorHistory;
