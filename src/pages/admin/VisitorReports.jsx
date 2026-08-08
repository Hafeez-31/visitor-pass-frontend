import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import StatusBadge from '../../components/StatusBadge.jsx';
import api from '../../api/axios';

const VisitorReports = () => {
  const [range, setRange] = useState('today');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchReport = async (r = range) => {
    setLoading(true);
    setError('');
    try {
      const params = { range: r };
      if (r === 'custom') {
        if (!from || !to) {
          setError('Please select both a from and to date for a custom range');
          setLoading(false);
          return;
        }
        params.from = from;
        params.to = to;
      }
      const { data } = await api.get('/reports/visitors', { params });
      setReport(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport('today');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRangeChange = (r) => {
    setRange(r);
    if (r !== 'custom') fetchReport(r);
  };

  return (
    <Layout>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Visitor Reports</h2>

      <div className="card mb-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex gap-2">
            {['today', 'week', 'custom'].map((r) => (
              <button
                key={r}
                onClick={() => handleRangeChange(r)}
                className={r === range ? 'btn-primary text-sm' : 'btn-secondary text-sm'}
              >
                {r === 'today' ? 'Today' : r === 'week' ? 'This Week' : 'Custom Range'}
              </button>
            ))}
          </div>
          {range === 'custom' && (
            <div className="flex items-end gap-2">
              <div>
                <label className="label">From</label>
                <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div>
                <label className="label">To</label>
                <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
              <button className="btn-primary" onClick={() => fetchReport('custom')}>Apply</button>
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>

      {loading && <p className="text-slate-500">Loading report…</p>}

      {report && !loading && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            {Object.entries(report.summary).map(([key, value]) => (
              <div key={key} className="card text-center">
                <p className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                <p className="text-2xl font-bold text-brand-700">{value}</p>
              </div>
            ))}
          </div>

          <div className="card overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 text-left">
                <tr>
                  <th className="px-4 py-3">Visitor</th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Visit Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {report.requests.map((r) => (
                  <tr key={r._id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{r.visitor?.name}</div>
                      <div className="text-xs text-slate-500">{r.visitor?.phone}</div>
                    </td>
                    <td className="px-4 py-3">{r.employee?.name}</td>
                    <td className="px-4 py-3">{new Date(r.visitDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
                {report.requests.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-400">No records for this range</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Layout>
  );
};

export default VisitorReports;
