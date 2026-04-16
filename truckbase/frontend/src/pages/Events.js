import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const EVENT_TYPES = ['FESTIVAL', 'CATERING', 'PRIVATE_EVENT', 'REGULAR_SPOT', 'OTHER'];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', startDate: '', endDate: '', location: '', 
    address: '', type: 'OTHER', fee: '', notes: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/events`);
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/events`, formData);
      setShowForm(false);
      fetchEvents();
    } catch (error) {
      alert('Failed to create event');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎉 Events</h1>
          <p className="text-gray-600 mt-2">Manage festivals, catering, and private bookings</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          + Add Event
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Event Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="px-4 py-3 border rounded-lg" required />
            <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="px-4 py-3 border rounded-lg">
              {EVENT_TYPES.map(type => <option key={type} value={type}>{type.replace('_', ' ')}</option>)}
            </select>
            <input type="datetime-local" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="px-4 py-3 border rounded-lg" required />
            <input type="datetime-local" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="px-4 py-3 border rounded-lg" required />
            <input type="text" placeholder="Location/Venue" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="px-4 py-3 border rounded-lg" required />
            <input type="text" placeholder="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="px-4 py-3 border rounded-lg" />
            <input type="number" step="0.01" placeholder="Fee ($)" value={formData.fee} onChange={(e) => setFormData({...formData, fee: parseFloat(e.target.value)})} className="px-4 py-3 border rounded-lg" />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="px-4 py-3 border rounded-lg col-span-2" rows={3} />
            <textarea placeholder="Notes" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="px-4 py-3 border rounded-lg col-span-2" rows={2} />
          </div>
          <div className="mt-4 flex gap-4">
            <button type="submit" className="px-6 py-3 bg-primary-600 text-white rounded-lg">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-gray-200 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-xl text-gray-900">{event.name}</h3>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">{event.type.replace('_', ' ')}</span>
                </div>
                <p className="text-gray-600 mt-2">{event.description}</p>
                <div className="flex gap-6 mt-4 text-sm text-gray-600">
                  <span>📅 {new Date(event.startDate).toLocaleString()}</span>
                  <span>📍 {event.location}</span>
                  {event.fee && <span>💰 ${event.fee}</span>}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                event.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                event.status === 'COMPLETED' ? 'bg-gray-100 text-gray-700' :
                'bg-green-100 text-green-700'
              }`}>
                {event.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
