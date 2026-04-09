import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const Permits = () => {
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'HEALTH_PERMIT', name: '', permitNumber: '', expiryDate: '', notes: ''
  });

  const PERMIT_TYPES = ['HEALTH_PERMIT', 'BUSINESS_LICENSE', 'FIRE_SAFETY', 'PARKING_PERMIT', 'VENDOR_LICENSE', 'OTHER'];

  useEffect(() => {
    fetchPermits();
  }, []);

  const fetchPermits = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/permits`);
      setPermits(data);
    } catch (error) {
      console.error('Failed to fetch permits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/permits`, { ...formData, issuedDate: new Date().toISOString() });
      setShowForm(false);
      fetchPermits();
    } catch (error) {
      alert('Failed to create permit');
    }
  };

  const getStatusColor = (permit) => {
    if (permit.isExpired) return 'bg-red-100 text-red-700';
    if (permit.expiresSoon) return 'bg-orange-100 text-orange-700';
    return 'bg-green-100 text-green-700';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📋 Permits</h1>
          <p className="text-gray-600 mt-2">Track compliance and avoid fines</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          + Add Permit
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="px-4 py-3 border rounded-lg"
            >
              {PERMIT_TYPES.map(type => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Permit Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="px-4 py-3 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Permit Number"
              value={formData.permitNumber}
              onChange={(e) => setFormData({...formData, permitNumber: e.target.value})}
              className="px-4 py-3 border rounded-lg"
            />
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
              className="px-4 py-3 border rounded-lg"
              required
            />
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="px-4 py-3 border rounded-lg col-span-2"
              rows={3}
            />
          </div>
          <div className="mt-4 flex gap-4">
            <button type="submit" className="px-6 py-3 bg-primary-600 text-white rounded-lg">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-gray-200 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {permits.map((permit) => (
          <div key={permit.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg text-gray-900">{permit.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(permit)}`}>
                  {permit.isExpired ? 'EXPIRED' : permit.expiresSoon ? 'EXPIRING SOON' : 'ACTIVE'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1">{permit.type.replace('_', ' ')}</p>
              {permit.permitNumber && <p className="text-gray-500 text-sm">#{permit.permitNumber}</p>}
              <p className="text-gray-600 text-sm mt-2">Expires: {new Date(permit.expiryDate).toLocaleDateString()}</p>
            </div>
            {permit.notes && <p className="text-gray-500 text-sm max-w-md">{permit.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Permits;
