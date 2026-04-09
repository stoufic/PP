import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const CATEGORIES = ['FOOD', 'BEVERAGE', 'SUPPLIES', 'EQUIPMENT', 'CLEANING', 'OTHER'];

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: 'FOOD', quantity: 0, unit: '', minQuantity: 0, 
    maxQuantity: 0, spaceRequired: 0, costPerUnit: '', supplier: '', location: ''
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/inventory`);
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/inventory`, formData);
      setShowForm(false);
      fetchInventory();
    } catch (error) {
      alert('Failed to create item');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📦 Inventory</h1>
          <p className="text-gray-600 mt-2">Space-aware stock management for mobile kitchens</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          + Add Item
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <input type="text" placeholder="Item Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="px-4 py-3 border rounded-lg col-span-2" required />
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="px-4 py-3 border rounded-lg">
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input type="number" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})} className="px-4 py-3 border rounded-lg" required />
            <input type="text" placeholder="Unit (lbs, oz, etc)" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className="px-4 py-3 border rounded-lg" required />
            <input type="number" placeholder="Min Quantity" value={formData.minQuantity} onChange={(e) => setFormData({...formData, minQuantity: parseInt(e.target.value)})} className="px-4 py-3 border rounded-lg" required />
            <input type="number" placeholder="Max Quantity" value={formData.maxQuantity} onChange={(e) => setFormData({...formData, maxQuantity: parseInt(e.target.value)})} className="px-4 py-3 border rounded-lg" required />
            <input type="number" step="0.1" placeholder="Space (cu ft)" value={formData.spaceRequired} onChange={(e) => setFormData({...formData, spaceRequired: parseFloat(e.target.value)})} className="px-4 py-3 border rounded-lg" />
            <input type="number" step="0.01" placeholder="Cost per Unit" value={formData.costPerUnit} onChange={(e) => setFormData({...formData, costPerUnit: parseFloat(e.target.value)})} className="px-4 py-3 border rounded-lg" />
            <input type="text" placeholder="Supplier" value={formData.supplier} onChange={(e) => setFormData({...formData, supplier: e.target.value})} className="px-4 py-3 border rounded-lg" />
            <input type="text" placeholder="Storage Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="px-4 py-3 border rounded-lg col-span-2" />
          </div>
          <div className="mt-4 flex gap-4">
            <button type="submit" className="px-6 py-3 bg-primary-600 text-white rounded-lg">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-gray-200 rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className={`bg-white p-6 rounded-xl shadow-sm border ${item.isLowStock ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">{item.category}</span>
              </div>
              {item.isLowStock && <span className="text-red-600 text-xs font-medium">⚠️ Low Stock</span>}
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">{item.quantity} <span className="text-sm font-normal text-gray-600">{item.unit}</span></p>
              <p className="text-sm text-gray-500 mt-1">Min: {item.minQuantity} | Max: {item.maxQuantity}</p>
            </div>
            {item.supplier && <p className="text-sm text-gray-600 mt-3">Supplier: {item.supplier}</p>}
            {item.location && <p className="text-sm text-gray-500">Location: {item.location}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
