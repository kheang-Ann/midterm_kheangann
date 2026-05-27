import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const InventoryEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    quantity: 0,
    price: 0,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await axios.get(`/api/inventory/${id}`);
      setFormData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load item');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await axios.patch(`/api/inventory/${id}`, formData);
      navigate('/inventory');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading item...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Edit Item</h1>
      </div>

      <div className="card">
        {error && <div className="error-message" data-testid="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              data-testid="name-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sku">SKU *</label>
            <input
              type="text"
              id="sku"
              name="sku"
              data-testid="sku-input"
              value={formData.sku}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              data-testid="description-input"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              data-testid="quantity-input"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input
              type="number"
              id="price"
              name="price"
              data-testid="price-input"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="actions">
            <button 
              type="submit" 
              className="btn-success"
              data-testid="submit-button"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Item'}
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/inventory')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryEdit;
