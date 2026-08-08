import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../api/axios';

const CheckOut = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/requests', { params: { status: 'checked-in' } });
      setRequests(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load checked-in visitors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCheckOut = async (id) => {
    setActingId(id);
    setError('');
    try {
      await api.put(`/requests/${id}/checkout`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check out visitor');
    } finally {
      setActingId(null);
    }
  };

  return (
    <Layout>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Check Out Visitors</h2>
      <p className="text-slate-500 mb-4 text-sm">Visitors currently inside.</p>

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
                <th className="px-4 py-3">Check-In Time</th>
                <th className="px-4 py-3">Status</th>
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
                  <td className="px-4 py-3">{r.checkInTime ? new Date(r.checkInTime).toLocaleString() : '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">
                    <button className="btn-primary text-xs" disabled={actingId === r._id} onClick={() => handleCheckOut(r._id)}>
                      {actingId === r._id ? 'Checking out…' : 'Check Out'}
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-400">No visitors currently inside</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default CheckOut;
