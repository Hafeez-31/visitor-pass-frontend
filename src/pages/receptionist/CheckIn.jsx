import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../api/axios';

const CheckIn = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/requests', { params: { status: 'approved' } });
      setRequests(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load approved visitors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCheckIn = async (id) => {
    setActingId(id);
    setError('');
    try {
      await api.put(`/requests/${id}/checkin`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check in visitor');
    } finally {
      setActingId(null);
    }
  };

  return (
    <Layout>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Check In Visitors</h2>
      <p className="text-slate-500 mb-4 text-sm">Approved visitors awaiting check-in.</p>

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
                <th className="px-4 py-3">Arrival Time</th>
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
                  <td className="px-4 py-3">{new Date(r.visitDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{r.expectedArrivalTime}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">
                    <button className="btn-primary text-xs" disabled={actingId === r._id} onClick={() => handleCheckIn(r._id)}>
                      {actingId === r._id ? 'Checking in…' : 'Check In'}
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-slate-400">No approved visitors waiting to check in</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default CheckIn;
