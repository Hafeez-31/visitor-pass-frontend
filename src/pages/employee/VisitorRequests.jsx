import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../api/axios';

const VisitorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actingId, setActingId] = useState(null);
  const [remarkDrafts, setRemarkDrafts] = useState({});
  const [rejectDrafts, setRejectDrafts] = useState({});

  const load = async (status = statusFilter) => {
    setLoading(true);
    try {
      const params = status ? { status } : {};
      const { data } = await api.get('/requests', { params });
      setRequests(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load visitor requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleApprove = async (id) => {
    setActingId(id);
    setError('');
    try {
      await api.put(`/requests/${id}/approve`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve request');
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id) => {
    setActingId(id);
    setError('');
    try {
      await api.put(`/requests/${id}/reject`, { reason: rejectDrafts[id] || '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject request');
    } finally {
      setActingId(null);
    }
  };

  const handleAddRemark = async (id) => {
    const text = remarkDrafts[id];
    if (!text) return;
    setActingId(id);
    try {
      await api.put(`/requests/${id}/remark`, { text });
      setRemarkDrafts({ ...remarkDrafts, [id]: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add remark');
    } finally {
      setActingId(null);
    }
  };

  return (
    <Layout>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Visitor Requests</h2>

      <div className="flex gap-2 mb-4">
        {['pending', 'approved', 'rejected', ''].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setStatusFilter(s)}
            className={s === statusFilter ? 'btn-primary text-sm' : 'btn-secondary text-sm'}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg border border-red-200 mb-4">{error}</div>}

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r._id} className="card">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="font-semibold text-slate-800">{r.visitor?.name}</p>
                  <p className="text-sm text-slate-500">{r.visitor?.phone} {r.visitor?.company ? `• ${r.visitor.company}` : ''}</p>
                  <p className="text-sm text-slate-600 mt-1">Purpose: {r.purpose}</p>
                  <p className="text-sm text-slate-600">
                    {new Date(r.visitDate).toLocaleDateString()} at {r.expectedArrivalTime}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              {r.remarks?.length > 0 && (
                <div className="mt-3 border-t border-slate-100 pt-3 space-y-1">
                  {r.remarks.map((rem, idx) => (
                    <p key={idx} className="text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{rem.addedBy?.name || 'You'}:</span> {rem.text}
                    </p>
                  ))}
                </div>
              )}

              {r.status === 'pending' && (
                <div className="mt-4 border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex gap-2">
                    <button className="btn-primary text-sm" disabled={actingId === r._id} onClick={() => handleApprove(r._id)}>
                      Approve
                    </button>
                    <input
                      className="input text-sm"
                      placeholder="Rejection reason (optional)"
                      value={rejectDrafts[r._id] || ''}
                      onChange={(e) => setRejectDrafts({ ...rejectDrafts, [r._id]: e.target.value })}
                    />
                    <button className="btn-danger text-sm whitespace-nowrap" disabled={actingId === r._id} onClick={() => handleReject(r._id)}>
                      Reject
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <input
                  className="input text-sm"
                  placeholder="Add a remark…"
                  value={remarkDrafts[r._id] || ''}
                  onChange={(e) => setRemarkDrafts({ ...remarkDrafts, [r._id]: e.target.value })}
                />
                <button className="btn-secondary text-sm whitespace-nowrap" disabled={actingId === r._id} onClick={() => handleAddRemark(r._id)}>
                  Add Remark
                </button>
              </div>
            </div>
          ))}
          {requests.length === 0 && <p className="text-slate-400 text-center py-8">No visitor requests found</p>}
        </div>
      )}
    </Layout>
  );
};

export default VisitorRequests;
