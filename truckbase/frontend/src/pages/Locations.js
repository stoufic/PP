import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', address: '', city: '', state: '', zipCode: '',
    latitude: '', longitude: '', notes: ''
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/locations`);
      setLocations(data);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/locations`, formData);
      setShowForm(false);
      setFormData({ name: '', address: '', city: '', state: '', zipCode: '', latitude: '', longitude: '', notes: '' });
      fetchLocations();
    } catch (error) {
      alert('Failed to create location');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📍 Locations</h1>
          <p className="text-gray-600 mt-2">Track your favorite spots and profitability</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          + Add Location
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Location Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="px-4 py-3 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="px-4 py-3 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="px-4 py-3 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="px-4 py-3 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="ZIP Code"
              value={formData.zipCode}
              onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
              className="px-4 py-3 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="px-4 py-3 border rounded-lg"
            />
          </div>
          <div className="mt-4 flex gap-4">
            <button type="submit" className="px-6 py-3 bg-primary-600 text-white rounded-lg">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-gray-200 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div key={loc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg text-gray-900">{loc.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{loc.address}</p>
            <p className="text-gray-600 text-sm">{loc.city}, {loc.state} {loc.zipCode}</p>
            {loc.avgRevenue && (
              <p className="mt-3 text-secondary-600 font-medium">Avg Revenue: ${loc.avgRevenue}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">Visits: {loc.visitCount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Locations;
