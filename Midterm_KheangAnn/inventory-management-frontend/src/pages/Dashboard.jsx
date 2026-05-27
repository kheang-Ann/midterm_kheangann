import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalValue: 0,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/inventory');
      const items = response.data;

      const totalItems = items.length;
      const lowStockItems = items.filter(item => item.quantity < 10).length;
      const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      setStats({ totalItems, lowStockItems, totalValue });
      setRecentItems(items.slice(0, 5));
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/inventory/create">
          <button className="btn-success">Add New Item</button>
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Items</h3>
          <div className="stat-value" data-testid="total-items">{stats.totalItems}</div>
        </div>
        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <div className="stat-value" data-testid="low-stock-items">{stats.lowStockItems}</div>
        </div>
        <div className="stat-card">
          <h3>Total Inventory Value</h3>
          <div className="stat-value" data-testid="total-value">${stats.totalValue.toFixed(2)}</div>
        </div>
      </div>

      <div className="card">
        <h2>Recent Items</h2>
        {recentItems.length === 0 ? (
          <p>No items in inventory</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {recentItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.sku}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
