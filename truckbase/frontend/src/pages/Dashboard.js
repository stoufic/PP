import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/reports/dashboard`);
      setDashboard(data);
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Good morning, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your food truck today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Weekly Revenue</p>
          <p className="text-3xl font-bold text-primary-600">
            ${dashboard?.revenue.weekly.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Daily Average</p>
          <p className="text-3xl font-bold text-secondary-600">
            ${dashboard?.revenue.dailyAverage.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Expiring Permits</p>
          <p className={`text-3xl font-bold ${dashboard?.alerts.expiringPermits > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {dashboard?.alerts.expiringPermits || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Low Stock Items</p>
          <p className={`text-3xl font-bold ${dashboard?.alerts.lowStockItems?.length > 0 ? 'text-orange-600' : 'text-green-600'}`}>
            {dashboard?.alerts.lowStockItems?.length || 0}
          </p>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📍 Today's Schedule</h2>
          {dashboard?.schedule.today?.length > 0 ? (
            <div className="space-y-4">
              {dashboard.schedule.today.map((slot) => (
                <div key={slot.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{slot.location?.name || 'TBD'}</p>
                  <p className="text-sm text-gray-600">{slot.startTime} - {slot.endTime}</p>
                  <p className="text-sm text-gray-500">{slot.location?.address}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No locations scheduled for today.</p>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎉 Upcoming Events</h2>
          {dashboard?.events.upcoming?.length > 0 ? (
            <div className="space-y-4">
              {dashboard.events.upcoming.map((event) => (
                <div key={event.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">{event.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(event.startDate).toLocaleDateString()} • {event.location}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming events scheduled.</p>
          )}
        </div>
      </div>

      {/* Alerts */}
      {(dashboard?.alerts.expiringPermits > 0 || dashboard?.alerts.lowStockItems?.length > 0) && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">⚠️ Attention Needed</h2>
          
          {dashboard.alerts.expiringPermits > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">
                📋 {dashboard.alerts.expiringPermits} permit(s) expiring soon!
              </p>
              <p className="text-sm text-red-600 mt-1">Check the Permits page to review and renew.</p>
            </div>
          )}

          {dashboard.alerts.lowStockItems?.length > 0 && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-700 font-medium">
                📦 {dashboard.alerts.lowStockItems.length} item(s) low on stock:
              </p>
              <ul className="mt-2 space-y-1">
                {dashboard.alerts.lowStockItems.map((item) => (
                  <li key={item.name} className="text-sm text-orange-600">
                    • {item.name} ({item.quantity}/{item.minQuantity})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
