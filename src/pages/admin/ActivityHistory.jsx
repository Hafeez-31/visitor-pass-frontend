import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import api from '../../api/axios';

const ActivityHistory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/activity');
        setLogs(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load activity history');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Layout>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Activity History</h2>

      {loading && <p className="text-slate-500">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Visitor</th>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Performed By</th>
              <th className="px-4 py-3">Date &amp; Time</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-800">{log.action}</td>
                <td className="px-4 py-3">{log.visitRequest?.visitor?.name || '—'}</td>
                <td className="px-4 py-3">{log.visitRequest?.employee?.name || '—'}</td>
                <td className="px-4 py-3">
                  {log.performedBy?.name} <span className="text-xs text-slate-400 capitalize">({log.performedBy?.role})</span>
                </td>
                <td className="px-4 py-3">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-500">{log.details}</td>
              </tr>
            ))}
            {logs.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">No activity recorded yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ActivityHistory;
