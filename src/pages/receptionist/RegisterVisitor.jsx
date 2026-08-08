import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import api from '../../api/axios';

const emptyForm = {
  visitorName: '',
  visitorPhone: '',
  visitorEmail: '',
  visitorCompany: '',
  idProofType: '',
  idProofNumber: '',
  employeeId: '',
  purpose: '',
  visitDate: new Date().toISOString().slice(0, 10),
  expectedArrivalTime: '',
};

const RegisterVisitor = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/employees').then(({ data }) => setEmployees(data.filter((e) => e.isActive)));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      await api.post('/requests', form);
      setMessage('Visitor registered successfully. Request sent to the employee for approval.');
      setForm({ ...emptyForm, visitDate: new Date().toISOString().slice(0, 10) });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register visitor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Register Visitor</h2>

      <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4">
        {error && <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg border border-red-200">{error}</div>}
        {message && <div className="bg-emerald-50 text-emerald-700 text-sm px-3 py-2 rounded-lg border border-emerald-200">{message}</div>}

        <h3 className="font-semibold text-slate-700">Visitor Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" required value={form.visitorName} onChange={(e) => setForm({ ...form, visitorName: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input className="input" required value={form.visitorPhone} onChange={(e) => setForm({ ...form, visitorPhone: e.target.value })} />
          </div>
          <div>
            <label className="label">Email (optional)</label>
            <input type="email" className="input" value={form.visitorEmail} onChange={(e) => setForm({ ...form, visitorEmail: e.target.value })} />
          </div>
          <div>
            <label className="label">Company (optional)</label>
            <input className="input" value={form.visitorCompany} onChange={(e) => setForm({ ...form, visitorCompany: e.target.value })} />
          </div>
          <div>
            <label className="label">ID Proof Type (optional)</label>
            <input className="input" placeholder="e.g. Passport, Driver's License" value={form.idProofType} onChange={(e) => setForm({ ...form, idProofType: e.target.value })} />
          </div>
          <div>
            <label className="label">ID Proof Number (optional)</label>
            <input className="input" value={form.idProofNumber} onChange={(e) => setForm({ ...form, idProofNumber: e.target.value })} />
          </div>
        </div>

        <h3 className="font-semibold text-slate-700 pt-2">Visit Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="label">Employee to Visit</label>
            <select className="input" required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">Select employee…</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>{emp.name} — {emp.department}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Purpose of Visit</label>
            <input className="input" required value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
          </div>
          <div>
            <label className="label">Visit Date</label>
            <input
              type="date"
              className="input"
              required
              min={new Date().toISOString().slice(0, 10)}
              value={form.visitDate}
              onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Expected Arrival Time</label>
            <input type="time" className="input" required value={form.expectedArrivalTime} onChange={(e) => setForm({ ...form, expectedArrivalTime: e.target.value })} />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Registering…' : 'Register Visitor'}
        </button>
      </form>
    </Layout>
  );
};

export default RegisterVisitor;
