import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.jsx';
import api from '../../api/axios';

const emptyForm = { name: '', email: '', phone: '', department: '', designation: '' };

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async (q = '') => {
    setLoading(true);
    try {
      const { data } = await api.get('/employees', { params: q ? { search: q } : {} });
      setEmployees(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(search);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      if (editingId) {
        await api.put(`/employees/${editingId}`, form);
        setMessage('Employee updated successfully');
      } else {
        await api.post('/employees', form);
        setMessage('Employee created successfully');
      }
      resetForm();
      load(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save employee');
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setForm({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      department: emp.department,
      designation: emp.designation,
    });
  };

  const toggleActive = async (emp) => {
    await api.put(`/employees/${emp._id}`, { isActive: !emp.isActive });
    load(search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this employee? This cannot be undone.')) return;
    await api.delete(`/employees/${id}`);
    load(search);
  };

  return (
    <Layout>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Manage Employees</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="card space-y-3 lg:col-span-1 h-fit">
          <h3 className="font-semibold text-slate-700">{editingId ? 'Edit Employee' : 'Add Employee'}</h3>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-emerald-600">{message}</p>}
          <div>
            <label className="label">Full Name</label>
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" required disabled={!!editingId} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Department</label>
            <input className="input" required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </div>
          <div>
            <label className="label">Designation</label>
            <input className="input" required value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn-primary flex-1">{editingId ? 'Update' : 'Create'}</button>
            {editingId && (
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </form>

        <div className="lg:col-span-2">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              className="input"
              placeholder="Search by name, email or department"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn-secondary" type="submit">Search</button>
          </form>

          {loading ? (
            <p className="text-slate-500">Loading…</p>
          ) : (
            <div className="card overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 text-left">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{emp.name}</div>
                        <div className="text-xs text-slate-500">{emp.email}</div>
                      </td>
                      <td className="px-4 py-3">{emp.department}</td>
                      <td className="px-4 py-3">{emp.designation}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${emp.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                          {emp.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 space-x-2 whitespace-nowrap">
                        <button className="text-brand-600 hover:underline" onClick={() => handleEdit(emp)}>Edit</button>
                        <button className="text-amber-600 hover:underline" onClick={() => toggleActive(emp)}>
                          {emp.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="text-red-600 hover:underline" onClick={() => handleDelete(emp._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-400">No employees found</td>
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

export default ManageEmployees;
