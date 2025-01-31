import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditSupplier = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    supplierName: '',
    email: '',
    phone: '',
    supplyProducts: '',
    paymentTerms: ''
  });

  useEffect(() => {
    fetchSupplier();
  }, [id]);

  const fetchSupplier = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/suppliers/${id}`);
      setFormData(response.data);
    } catch (error) {
      setError('Error fetching supplier: ' + (error.response?.data?.message || error.message));
    }
  };

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
      await axios.put(`http://localhost:5000/api/suppliers/${id}`, {
        supplierName: formData.supplierName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.replace(/\D/g, ''),
        supplyProducts: formData.supplyProducts.trim(),
        paymentTerms: formData.paymentTerms.trim()
      });
      navigate('/dashboard/suppliers/manage');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating supplier. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
        <h2 className="text-center mb-4" style={{ color: '#000', textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)' }}>Edit Supplier</h2>
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
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
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

          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ 
                background: 'rgba(13, 110, 253, 0.9)',
                backdropFilter: 'blur(5px)',
                border: 'none'
              }}
            >
              Update Supplier
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard/suppliers/manage')}
              className="btn btn-outline-secondary"
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                borderColor: 'rgba(108, 117, 125, 0.5)'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplier;
