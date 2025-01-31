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
      const response = await axios.post('http://localhost:5000/api/suppliers', {
        supplierName: formData.supplierName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.replace(/\D/g, ''),
        supplyProducts: formData.supplyProducts.trim(),
        paymentTerms: formData.paymentTerms.trim()
      });
      
      if (response.data) {
        navigate('/dashboard/suppliers/manage');
      }
    } catch (error) {
      console.error('Error creating supplier:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error adding supplier';
      setError(errorMessage);
    }
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
        <h2 className="text-center mb-4" style={{ color: '#000', textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)' }}>Add New Supplier</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ background: 'transparent' }}>
          <div className="mb-3">
            <label className="form-label">Supplier Name</label>
            <input
              type="text"
              className="form-control"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              required
              style={{ 
                background: 'rgba(255, 255, 255, 0.6)', 
                backdropFilter: 'blur(5px)',
                color: '#fff'
              }}
            />
          </div>

          <div className="mb-3">
  <label htmlFor="email" className="form-label">Email</label>
  <input
    id="email"
    type="email"
    className="form-control"
    name="email"
    value={formData.email}
    onChange={handleChange}
    required
    style={{
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      
      color: '#fff',
    }}
  />
</div>


          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              style={{ 
                background: 'rgba(255, 255, 255, 0.6)', 
                backdropFilter: 'blur(5px)',
                color: '#fff'
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Supply Products</label>
            <input
              type="text"
              className="form-control"
              name="supplyProducts"
              value={formData.supplyProducts}
              onChange={handleChange}
              required
              style={{ 
                background: 'rgba(255, 255, 255, 0.6)', 
                backdropFilter: 'blur(5px)',
                color: '#fff'
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Payment Terms</label>
            <input
              type="text"
              className="form-control"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              required
              style={{ 
                background: 'rgba(255, 255, 255, 0.6)', 
                backdropFilter: 'blur(5px)',
                color: '#fff'
              }}
            />
          </div>

          <div className="d-grid">
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ 
                background: 'rgba(13, 110, 253, 0.9)',
                backdropFilter: 'blur(5px)',
                border: 'none'
              }}
            >
              Add Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;
