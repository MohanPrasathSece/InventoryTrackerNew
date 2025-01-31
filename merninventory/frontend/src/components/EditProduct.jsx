import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    supplier: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, suppliersRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/products/${id}`),
          axios.get('http://localhost:5000/api/suppliers')
        ]);

        if (productRes.data) {
          setFormData({
            productName: productRes.data.productName,
            description: productRes.data.description,
            category: productRes.data.category,
            price: productRes.data.price,
            quantity: productRes.data.quantity,
            supplier: productRes.data.supplier
          });
        }
        setSuppliers(suppliersRes.data);
      } catch (error) {
        setError('Error fetching data: ' + (error.response?.data?.message || error.message));
      }
    };

    fetchData();
  }, [id]);

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
      await axios.put(`http://localhost:5000/api/products/${id}`, formData);
      navigate('/dashboard/products/manage');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating product. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
        <h2 className="text-center mb-4" style={{ color: '#000' }}>Edit Product</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              style={{ 
                background: '#fff',
                color: '#000'
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="2"
              style={{ 
                background: '#fff',
                color: '#000'
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{ 
                background: '#fff',
                color: '#000'
              }}
            />
          </div>

          <div className="row mb-3">
            <div className="col-6">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                style={{ 
                  background: '#fff',
                  color: '#000'
                }}
              />
            </div>
            <div className="col-6">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                style={{ 
                  background: '#fff',
                  color: '#000'
                }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Supplier</label>
            <select
              className="form-select"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
              style={{ 
                background: '#fff',
                color: '#000'
              }}
            >
              <option value="">Select Supplier</option>
              {suppliers.map(supplier => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.supplierName}
                </option>
              ))}
            </select>
          </div>

          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Update Product
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/dashboard/products/manage')}
              className="btn btn-outline-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
