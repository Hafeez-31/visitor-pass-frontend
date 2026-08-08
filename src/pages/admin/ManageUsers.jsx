import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import api from '../../api/axios';

const emptyForm = { name: '', email: '', password: '', role: 'receptionist', employeeId: '' };

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [usersRes, employeesRes] = await Promise.all([api.get('/users'), api.get('/employees')]);
      setUsers(usersRes.data);
      setEmployees(employeesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const payload = { ...form };
      if (payload.role !== 'employee') delete payload.employeeId;
      await api.post('/users', payload);
      setMessage('User account created successfully');
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  const toggleActive = async (u) => {
    await api.put(`/users/${u.id || u._id}`, { isActive: !u.isActive });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this user account?')) return;
    await api.delete(`/users/${id}`);
    load();
  };

  return (
    <Layout>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Manage User Accounts</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="card space-y-3 h-fit">
          <h3 className="font-semibold text-slate-700">Create User Account</h3>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-emerald-600">{message}</p>}
          <div>
            <label className="label">Full Name</label>
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="admin">Administrator</option>
              <option value="receptionist">Receptionist</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          {form.role === 'employee' && (
            <div>
              <label className="label">Linked Employee</label>
              <select className="input" required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
                <option value="">Select employee…</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>{emp.name} — {emp.department}</option>
                ))}
              </select>
            </div>
          )}
          <button type="submit" className="btn-primary w-full">Create Account</button>
        </form>

        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-slate-500">Loading…</p>
          ) : (
            <div className="card overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 text-left">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </td>
                      <td className="px-4 py-3 capitalize">{u.role}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                        <button className="text-amber-600 hover:underline" onClick={() => toggleActive(u)}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="text-red-600 hover:underline" onClick={() => handleDelete(u._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-slate-400">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ManageUsers;
