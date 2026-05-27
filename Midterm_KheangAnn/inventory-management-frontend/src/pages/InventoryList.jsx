import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/inventory');
      setItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load inventory items');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await axios.delete(`/api/inventory/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading inventory...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Inventory Items</h1>
        <Link to="/inventory/create">
          <button className="btn-success" data-testid="add-item-button">Add New Item</button>
        </Link>
      </div>

      {error && <div className="error-message" data-testid="error-message">{error}</div>}

      <div className="card">
        <div className="form-group">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="search-input"
          />
        </div>

        {filteredItems.length === 0 ? (
          <p data-testid="no-items-message">No items found</p>
        ) : (
          <table data-testid="inventory-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} data-testid={`item-row-${item.id}`}>
                  <td>{item.name}</td>
                  <td>{item.sku}</td>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <div className="actions">
                      <Link to={`/inventory/edit/${item.id}`}>
                        <button className="btn-warning" data-testid={`edit-button-${item.id}`}>Edit</button>
                      </Link>
                      <button 
                        className="btn-danger" 
                        onClick={() => handleDelete(item.id)}
                        data-testid={`delete-button-${item.id}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InventoryList;
