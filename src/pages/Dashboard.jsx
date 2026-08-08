import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setCards(data.cards || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Layout>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Welcome, {user?.name}</h2>
      <p className="text-slate-500 mb-6">Here's what's happening today.</p>

      {loading && <p className="text-slate-500">Loading dashboard…</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="card">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="text-3xl font-bold text-brand-700 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {!loading && cards.length === 0 && !error && (
        <div className="card text-slate-500 text-sm mt-4">
          No dashboard data yet — this account may not be fully set up (e.g. an employee account without a
          linked employee record).
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
