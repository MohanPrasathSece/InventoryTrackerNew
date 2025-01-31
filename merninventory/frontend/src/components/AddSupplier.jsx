import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddSupplier = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    supplierName: '',
    email: '',
    phone: '',
    supplyProducts: '',
    paymentTerms: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:5000/api/suppliers', formData);
      // Navigate immediately after successful response
      navigate('/dashboard/suppliers/manage');
    } catch (error) {
      console.error('Error creating supplier:', error);
      setError(error.response?.data?.message || 'Error adding supplier. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Supplier</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="supplierName" className="form-label">Supplier Name</label>
          <input
            type="text"
            className="form-control"
            id="supplierName"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit phone number"
            pattern="[0-9]{10}"
            required
          />
          <small className="text-muted">Please enter a 10-digit phone number</small>
        </div>

        <div className="mb-3">
          <label htmlFor="supplyProducts" className="form-label">Supply Products</label>
          <input
            type="text"
            className="form-control"
            id="supplyProducts"
            name="supplyProducts"
            value={formData.supplyProducts}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="paymentTerms" className="form-label">Payment Terms</label>
          <input
            type="text"
            className="form-control"
            id="paymentTerms"
            name="paymentTerms"
            value={formData.paymentTerms}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <button type="submit" className="btn btn-primary me-2">
            Add Supplier
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard/suppliers/manage')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSupplier;
